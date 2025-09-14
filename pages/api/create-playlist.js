import { ApolloServer } from 'apollo-server-micro';
import { typeDefs } from '@/graphQl/type-definitions';
import { query } from '@/lib/db';
import { getSession } from 'next-auth/react';
import { getUserByEmail } from '@/lib/utils';

const resolvers = {
  Mutation: {
    addPlaylist: async (root, { input: { name, observation, restrictionId, entries } }, context) => {

      const user = await getUserByEmail({ context, query });
      if (!user) {
        return null;
      }

      if (!name || name.trim().length === 0 || !restrictionId) {
        console.error('`name` and `restriction id` are required.');
        return null;
      }

      let playlist = {
        name: name,
        observation: observation,
        restrictionId: restrictionId,
        ownerId: user.id,
      }

      let results = await query(`
        INSERT INTO 
          playlist (name, observation, restriction_id, owner_id)
        VALUES 
          ($1, $2, $3, $4)
        RETURNING id
        `,
        [playlist.name, playlist.observation, playlist.restrictionId, playlist.ownerId]
      );

      playlist.id = results[0].id;

      if (entries && entries.length) {
        for (const entry of entries) {
          await query(`
            INSERT INTO 
                playlist_entry (song_id, order_index, playlist_id)
            VALUES 
                ($1, $2, $3)
            `,
            [entry.songId, entry.orderIndex, playlist.id]
          );
        }
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
    
    const handler = server.createHandler({ path: '/api/create-playlist' });
    return handler(req, res);
}