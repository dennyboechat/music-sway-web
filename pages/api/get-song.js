import { ApolloServer } from 'apollo-server-micro';
import { query } from '@/lib/db';
import { forEach } from 'lodash';
import { typeDefs } from '@/graphQl/type-definitions';
import { getSession } from 'next-auth/react';
import { getUserByEmail } from '@/lib/utils';

const resolvers = {
  Query: {
    song: async (root, { id }, context) => {

      const user = await getUserByEmail({ context, query });
      if (!user) {
        return null;
      }

      const results = await query(`
          SELECT 
            song.id AS song_id, 
            song.title AS song_title,
            song.artist AS song_artist,
            song.category AS song_category,
            song.observation AS song_observation,
            song.restriction_id AS song_restriction_id,
            song.owner_id AS song_owner_id,
            song_entry.id AS entry_id, 
            song_entry.title AS entry_title, 
            song_entry.content AS entry_content,
            u.name AS owner_name
          FROM 
            song
          LEFT JOIN 
            song_entry ON song_entry.song_id = song.id
          LEFT JOIN
            "user" u ON u.id = song.owner_id
          WHERE 
            song.id = $1 AND
            song.owner_id = $2
          `,
        [
          id,
          user.id
        ]
      );

      if (!results || results.length === 0) {
        return null;
      }

      // Get the first result to extract song data
      const firstResult = results[0];
      
      // If the first result doesn't have a song ID, return null
      if (!firstResult.song_id) {
        return null;
      }

      let song = {
        id: firstResult.song_id,
        title: firstResult.song_title,
        artist: firstResult.song_artist,
        category: firstResult.song_category,
        observation: firstResult.song_observation,
        restrictionId: firstResult.song_restriction_id,
        ownerId: firstResult.song_owner_id,
        entries: [],
      };
      
      // Add all entries from the results
      forEach(results, data => {
        if (data.entry_id) {
          song.entries.push({
            id: data.entry_id,
            title: data.entry_title,
            content: data.entry_content
          });
        }
      });

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

export default server.createHandler({ path: '/api/get-song' });
