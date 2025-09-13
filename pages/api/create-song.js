import { ApolloServer } from 'apollo-server-micro';
import { typeDefs } from '@/graphQl/type-definitions';
import { query } from '@/lib/db';
import { getSession } from 'next-auth/react';
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
      
      let results;
      try {
        results = await query(`
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
      } catch (error) {
        console.error('INSERT ERROR:', error);
        
        // If we get a unique constraint violation, try to fix the sequence
        if (error.code === '23505' && error.constraint === 'song_pkey') {
          console.log('Attempting to fix song sequence...');
          try {
            // Reset the sequence to the max ID + 1
            await query(`SELECT setval('song_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM song), false)`);
            
            // Try the insert again
            results = await query(`
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
          } catch (retryError) {
            console.error('RETRY INSERT ERROR:', retryError);
            throw retryError;
          }
        } else {
          throw error;
        }
      }
      
      console.log('INSERT RESULTS:', JSON.stringify(results, null, 2));

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
  context: async ({ req }) => {
    const session = await getSession({ req });
    return { session };
  },
});

export default server.createHandler({ path: '/api/create-song' });