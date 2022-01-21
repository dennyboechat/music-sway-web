import { ApolloServer } from 'apollo-server-micro';
import { query } from '@/lib/db'
import { forEach } from 'lodash';
import { typeDefs } from '@/graphQl/type-definitions';

const resolvers = {
  Query: {
    playlists: async () => {
      const results = await query(`
          SELECT 
            playlist.id as playlistId, 
            playlist.name as playlistName,
            playlist.observation as playlistObservation,
            playlist.restriction_id as playlistRestrictionId,
            playlist.owner_id as playlistOwnerId,
            playlist_entry.id as entryId, 
            playlist_entry.song_id as entrySongId, 
            playlist_entry.order_index as entryOrderIndex
          FROM 
            playlist
          LEFT JOIN 
            playlist_entry on playlist_entry.playlist_id = playlist.id
          ORDER BY 
            playlist.id DESC
      `)

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
        if (data.entryId) {
          playlist.entries.push({ id: data.entryId, songId: data.entrySongId, orderIndex: data.entryOrderIndex });
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

const server = new ApolloServer({ typeDefs, resolvers });

export default server.createHandler({ path: "/api/get-playlists" });