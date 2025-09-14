import { ApolloServer } from 'apollo-server-micro';
import { query } from '@/lib/db'
import { forEach } from 'lodash';
import { typeDefs } from '@/graphQl/type-definitions';
import { getServerSession } from 'next-auth/next';
import { getSession } from 'next-auth/react';
import { authOptions } from './auth/[...nextauth]';
import { getUserByEmail } from '@/lib/utils';

const resolvers = {
  Query: {
    songs: async (roots, { }, context) => {
      try {
        // Debug logging for production
        console.log('get-songs context:', {
          hasContext: !!context,
          hasSession: !!context?.session,
          hasUser: !!context?.session?.user,
          userEmail: context?.session?.user?.email,
          sessionKeys: context?.session ? Object.keys(context.session) : 'no session',
          userKeys: context?.session?.user ? Object.keys(context.session.user) : 'no user'
        });
        
        const user = await getUserByEmail({ context, query });
        console.log('getUserByEmail result:', user);
        
        if (!user) {
          console.log('No user found, returning null');
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
  context: async ({ req, res }) => {
    // Try the newer Next.js 15 compatible method first
    let session = null;
    try {
      session = await getServerSession(req, res, authOptions);
      console.log('Session from getServerSession:', session);
    } catch (error) {
      console.log('getServerSession failed, trying fallback:', error.message);
      // Fallback to the old method
      session = await getSession({ req });
      console.log('Session from getSession fallback:', session);
    }
    return { session };
  },
});

export default async function graphqlHandler(req, res) {
    if (!server.startedPromise) {
        server.startedPromise = server.start();
    }
    await server.startedPromise;
    
    const handler = server.createHandler({ path: '/api/get-songs' });
    return handler(req, res);
}