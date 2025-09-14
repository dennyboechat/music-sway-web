import { ApolloServer } from 'apollo-server-micro';
import { typeDefs } from '@/graphQl/type-definitions';
import { query } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { getSession } from 'next-auth/react';
import { authOptions } from './auth/[...nextauth]';
import { getUserByEmail } from '@/lib/utils';

const resolvers = {
  Mutation: {
    addSong: async (root, { input }, context) => {
      const { title, artist, category, observation, restrictionId, entries } = input;

      const user = await getUserByEmail({ context, query });
      if (!user) {
        return null;
      }

      if (!title || title.trim.length || !restrictionId) {
        console.error('`title` and `restriction id` are required.');
        return null;
      }

      let song = {
        title: title,
        artist: artist,
        category: category,
        observation: observation,
        restrictionId: restrictionId,
        ownerId: user.id,
      }
      
      const results = await query(`
          INSERT INTO 
            song (title, artist, category, observation, restriction_id, owner_id)
          VALUES 
            ($1, $2, $3, $4, $5, $6)
          RETURNING id
          `,
          [
            song.title,
            song.artist,
            song.category,
            song.observation,
            song.restrictionId,
            song.ownerId
          ]
        );

      song.id = results[0].id;

      if (entries && entries.length) {
        for (const entry of entries) {
          await query(`
            INSERT INTO 
                song_entry (title, content, song_id)
            VALUES 
                ($1, $2, $3)
            `,
            [entry.title, entry.content, song.id]
          );
        }
      }

      return song;
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
  context: async ({ req, res }) => {
    let session = null;
    try {
      session = await getServerSession(req, res, authOptions);
    } catch (error) {
      session = await getSession({ req });
    }
    return { session };
  },
});

export default async function graphqlHandler(req, res) {
    if (!server.startedPromise) {
        server.startedPromise = server.start();
    }
    await server.startedPromise;
    
    const handler = server.createHandler({ path: '/api/create-song' });
    return handler(req, res);
}