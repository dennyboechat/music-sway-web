import { ApolloServer } from 'apollo-server-micro';
import { query } from '@/lib/db'
import { forEach } from 'lodash';
import { typeDefs } from '@/graphQl/type-definitions';
import { getSession } from 'next-auth/react';
import { getUserByEmail } from '@/lib/utils';

const resolvers = {
  Query: {
    songs: async (roots, { }, context) => {
      try {
        const user = await getUserByEmail({ context, query });
        if (!user) {
          return null;
        }

        const results = await query(`
          SELECT 
            song.id, 
            song.title,
            song.artist,
            song.category,
            song.observation,
            song.restriction_id,
            song.owner_id,
            song_entry.id as entry_id, 
            song_entry.title as entry_title, 
            song_entry.content as entry_content,
            "user".name as owner_name
          FROM 
            song
          LEFT JOIN 
            song_entry ON song_entry.song_id = song.id
          LEFT JOIN
            "user" ON "user".id = song.owner_id
          WHERE
            song.owner_id = $1
          ORDER BY 
            song.id DESC
          `,
          [user.id]
        );

        let songs = []
        forEach(results, data => {
          let song = songs.find(e => e.id === data.id);
          if (!song) {
            song = {
              id: data.id,
              title: data.title,
              artist: data.artist,
              category: data.category,
              observation: data.observation,
              restrictionId: data.restriction_id,
              ownerId: data.owner_id,
              ownerName: data.owner_name,
              entries: [],
            }
            songs.push(song);
          }
          if (data.entry_id) {
            song.entries.push({
              id: data.entry_id,
              title: data.entry_title,
              content: data.entry_content
            });
          }
        });

        return songs;
      } catch (error) {
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
    try {
      // In production, we need to handle session differently
      const session = await getSession({ req });
      
      // Debug logging for production issues
      if (process.env.NODE_ENV === 'production' && !session) {
        console.log('No session found in production context');
      }
      
      return { session };
    } catch (error) {
      console.error('Error getting session:', error);
      return { session: null };
    }
  },
  // Disable introspection and playground in production for security
  introspection: process.env.NODE_ENV !== 'production',
  debug: process.env.NODE_ENV !== 'production',
});

export default async function graphqlHandler(req, res) {
    // Ensure server is started before handling requests
    if (!server.startedPromise) {
        server.startedPromise = server.start();
    }
    await server.startedPromise;
    
    // Create handler with proper configuration for production
    const handler = server.createHandler({ 
        path: '/api/get-songs',
        disableHealthCheck: true 
    });
    
    // Handle CORS for production
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    return handler(req, res);
}