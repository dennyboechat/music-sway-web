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
            playlist.id as playlistId, 
            playlist.name as playlistName,
            playlist.observation as playlistObservation,
            playlist.restriction_id as playlistRestrictionId,
            playlist.owner_id as playlistOwnerId,
            playlist_entry.id as entryId, 
            playlist_entry.song_id as entrySongId, 
            playlist_entry.order_index as entryOrderIndex,
            song.id as songId, 
            song.title as songTitle,
            song.artist as songArtist,
            song.category as songCategory,
            song.observation as songObservation,
            song.restriction_id as songRestrictionId,
            song.owner_id as songOwnerId,
            song_entry.id as songEntryId, 
            song_entry.title as songEntryTitle, 
            song_entry.content as songEntryContent
          FROM 
            playlist
          LEFT JOIN 
            playlist_entry on playlist_entry.playlist_id = playlist.id
          LEFT JOIN  
            song on song.id = playlist_entry.song_id
          LEFT JOIN  
            song_entry on song_entry.song_id = song.id
          WHERE
            playlist.owner_id = ?
          ORDER BY 
            playlist.name,
            playlist_entry.order_index
      `,
        [user.id]
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
              ownerId: data.ownerId,
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