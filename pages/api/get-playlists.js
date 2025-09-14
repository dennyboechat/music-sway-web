import { ApolloServer } from 'apollo-server-micro';
import { query } from '@/lib/db'
import { forEach } from 'lodash';
import { typeDefs } from '@/graphQl/type-definitions';
import { getSession } from 'next-auth/react';
import { getUserByEmail } from '@/lib/utils';

const resolvers = {
  Query: {
    playlists: async (root, { }, context) => {
      try {
        const user = await getUserByEmail({ context, query });
        if (!user) {
          return null;
        }

        const results = await query(`
          SELECT 
            playlist.id, 
            playlist.name,
            playlist.observation,
            playlist.restriction_id,
            playlist.owner_id,
            playlist_entry.id as entry_id, 
            playlist_entry.song_id as entry_song_id, 
            playlist_entry.order_index as entry_order_index,
            song.id as song_id, 
            song.title as song_title,
            song.artist as song_artist,
            song.category as song_category,
            song.observation as song_observation,
            song.restriction_id as song_restriction_id,
            song.owner_id as song_owner_id,
            song_entry.id as song_entry_id, 
            song_entry.title as song_entry_title, 
            song_entry.content as song_entry_content,
            "user".name as owner_name
          FROM 
            playlist
          LEFT JOIN 
            playlist_entry ON playlist_entry.playlist_id = playlist.id
          LEFT JOIN  
            song ON song.id = playlist_entry.song_id
          LEFT JOIN  
            song_entry ON song_entry.song_id = song.id
          LEFT JOIN
            "user" ON "user".id = playlist.owner_id
          LEFT JOIN
            band ON band.owner_id = playlist.owner_id
          WHERE
            playlist.owner_id = $1 OR
            (
              playlist.restriction_id = 2 AND 
              (
                SELECT 
                  band_subSelect.id
                FROM 
                  band AS band_subSelect
                INNER JOIN
                  user_band AS user_band_subSelect ON user_band_subSelect.band_id = band_subSelect.id
                WHERE 
                  band_subSelect.id IN (
                    SELECT 
                      band.id 
                    FROM 
                      band
                    LEFT JOIN 
                      user_band ON user_band.band_id = band.id
                    WHERE 
                      band.owner_id = playlist.owner_id OR
                      user_band.user_id = playlist.owner_id
                  )
                  AND
                  (
                    (
                      user_band_subSelect.band_user_status_id = 1 AND
                      user_band_subSelect.user_id = $2
                    ) OR
                    band_subSelect.owner_id = $3
                  )
                  LIMIT 1
              ) IS NOT NULL
            )
          ORDER BY 
            playlist.name,
            playlist_entry.order_index
        `,
        [
          user.id,
          user.id,
          user.id,
        ]
      );

      let playlists = []
      forEach(results, data => {
        let playlist = playlists.find(e => e.id === data.id);
        if (!playlist) {
          playlist = {
            id: data.id,
            name: data.name,
            observation: data.observation,
            restrictionId: data.restriction_id,
            ownerId: data.owner_id,
            ownerName: data.owner_name,
            entries: [],
          }
          playlists.push(playlist);
        }
        let playlistEntry = playlist.entries.find(e => e.id === data.entry_id);
        if (!playlistEntry && data.entry_id) {
          playlistEntry = {
            id: data.entry_id,
            orderIndex: data.entry_order_index,
            song: {
              id: data.song_id,
              title: data.song_title,
              artist: data.song_artist,
              category: data.song_category,
              observation: data.song_observation,
              restrictionId: data.song_restriction_id,
              ownerId: data.song_owner_id,
              entries: [],
            }
          };
          playlist.entries.push(playlistEntry);
        }
        if (playlistEntry && playlistEntry.song && data.song_entry_id) {
          let songEntry = playlistEntry.song.entries.find(e => e.id === data.song_entry_id);
          if (!songEntry) {
            songEntry = {
              id: data.song_entry_id,
              title: data.song_entry_title,
              content: data.song_entry_content
            };
            playlistEntry.song.entries.push(songEntry);
          }
        }
      });

        return playlists;
      } catch (error) {
        console.error('Error in playlists resolver:', error);
        throw error;
      }
    }
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const session = await getSession({ req });
    return { session };
  },
});

export default async function graphqlHandler(req, res) {
    if (!server.startedPromise) {
        server.startedPromise = server.start();
    }
    await server.startedPromise;
    
    const handler = server.createHandler({ path: '/api/get-playlists' });
    return handler(req, res);
}