import { ApolloServer } from 'apollo-server-micro';
import { query } from '@/lib/db'
import { forEach } from 'lodash';
import { typeDefs } from '@/graphQl/type-definitions';
import { getSession } from 'next-auth/react';
import { getUserByEmail } from '@/lib/utils';

const resolvers = {
  Query: {
    playlists: async (root, { }, context) => {

      const user = await getUserByEmail({ context, query });
      if (!user) {
        return null;
      }

      const results = await query(`
          SELECT 
            playlist.id AS playlistId, 
            playlist.name AS playlistName,
            playlist.observation AS playlistObservation,
            playlist.restriction_id AS playlistRestrictionId,
            playlist.owner_id AS playlistOwnerId,
            playlist_entry.id AS entryId, 
            playlist_entry.song_id AS entrySongId, 
            playlist_entry.order_index AS entryOrderIndex,
            song.id AS songId, 
            song.title AS songTitle,
            song.artist AS songArtist,
            song.category AS songCategory,
            song.observation AS songObservation,
            song.restriction_id AS songRestrictionId,
            song.owner_id AS songOwnerId,
            song_entry.id AS songEntryId, 
            song_entry.title AS songEntryTitle, 
            song_entry.content AS songEntryContent,
            user.name AS ownerName
          FROM 
            playlist
          LEFT JOIN 
            playlist_entry ON playlist_entry.playlist_id = playlist.id
          LEFT JOIN  
            song ON song.id = playlist_entry.song_id
          LEFT JOIN  
            song_entry ON song_entry.song_id = song.id
          LEFT JOIN
            user ON user.id = playlist.owner_id
          LEFT JOIN
            band ON band.owner_id = playlist.owner_id
          WHERE
            playlist.owner_id = ? OR
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
                      user_band_subSelect.user_id = ?
                    ) OR
                    band_subSelect.owner_id = ?
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
        let playlist = playlists.find(e => e.id === data.playlistId);
        if (!playlist) {
          playlist = {
            id: data.playlistId,
            name: data.playlistName,
            observation: data.playlistObservation,
            restrictionId: data.playlistRestrictionId,
            ownerId: data.playlistOwnerId,
            ownerName: data.ownerName,
            entries: [],
          }
          playlists.push(playlist);
        }
        let playlistEntry = playlist.entries.find(e => e.id === data.entryId);
        if (!playlistEntry && data.entryId) {
          playlistEntry = {
            id: data.entryId,
            orderIndex: data.entryOrderIndex,
            song: {
              id: data.songId,
              title: data.songTitle,
              artist: data.songArtist,
              category: data.songCategory,
              observation: data.songObservation,
              restrictionId: data.songRestrictionId,
              ownerId: data.songOwnerId,
              entries: [],
            }
          };
          playlist.entries.push(playlistEntry);
        }
        if (playlistEntry && playlistEntry.song && data.songEntryId) {
          let songEntry = playlistEntry.song.entries.find(e => e.id === data.songEntryId);
          if (!songEntry) {
            songEntry = {
              id: data.songEntryId,
              title: data.songEntryTitle,
              content: data.songEntryContent
            };
            playlistEntry.song.entries.push(songEntry);
          }
        }
      });

      return playlists;
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

export default server.createHandler({ path: "/api/get-playlists" });