import { ApolloServer } from 'apollo-server-micro';
import { typeDefs } from '@/graphQl/type-definitions';
import { query } from '@/lib/db';

const resolvers = {
  Mutation: {
    addPlaylist: async (root, { input: { name, observation, restrictionId, entries } }) => {

      if (!name || name.trim.length || !restrictionId) {
        console.error('`name` and `restriction id` are required.');
        return null;
      }

      let playlist = {
        name: name,
        observation: observation,
        restrictionId: restrictionId,
        ownerId: 1,
      }

      let results = await query(`
        INSERT INTO 
            playlist (name, observation, restriction_id, owner_id)
        VALUES 
          (?, ?, ?, ?)
        `,
        [playlist.name, playlist.observation, playlist.restrictionId, playlist.ownerId]
      );

      const playlistIdResults = await query(`
        SELECT 
            LAST_INSERT_ID() as playlistId
      `
      );
      playlist.id = playlistIdResults[0].playlistId;

      if (entries && entries.length) {
        const entryRows = entries.map(entry => [entry.songId, entry.orderIndex, playlist.id]);
        results = await query(`
          INSERT INTO 
              playlist_entry (song_id, order_index, playlist_id)
          VALUES 
              ?
          `,
          [entryRows]
        );
      }

      return playlist;
    }
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
}

const server = new ApolloServer({ typeDefs, resolvers });

export default server.createHandler({ path: "/api/create-playlist" });