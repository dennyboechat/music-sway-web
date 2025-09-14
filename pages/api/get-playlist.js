import { ApolloServer } from 'apollo-server-micro';
import { query } from '@/lib/db';
import { forEach } from 'lodash';
import { typeDefs } from '@/graphQl/type-definitions';
import { getSession } from 'next-auth/react';
import { getUserByEmail } from '@/lib/utils';

const resolvers = {
    Query: {
        playlist: async (root, { id }, context) => {

            const user = await getUserByEmail({ context, query });
            if (!user) {
                return null;
            }

            const results = await query(`
                SELECT 
                    playlist.id AS playlist_id, 
                    playlist.name AS playlist_name,
                    playlist.observation AS playlist_observation,
                    playlist.restriction_id AS playlist_restriction_id,
                    playlist.owner_id AS playlist_owner_id,
                    playlist_entry.id AS entry_id, 
                    playlist_entry.song_id AS entry_song_id, 
                    playlist_entry.order_index AS entry_order_index
                FROM 
                    playlist
                LEFT JOIN 
                    playlist_entry ON playlist_entry.playlist_id = playlist.id
                WHERE 
                    playlist.id = $1 AND
                    playlist.owner_id = $2
                `,
                [
                    id,
                    user.id
                ]
            );

            if (!results || results.length === 0) {
                console.error('Playlist not found or user does not have access.');
                return null;
            }

            let playlist = {
                entries: [],
            };
            
            // Initialize playlist data from first result (they're all the same for playlist info)
            if (results.length > 0) {
                const firstResult = results[0];
                playlist.id = firstResult.playlist_id;
                playlist.name = firstResult.playlist_name;
                playlist.observation = firstResult.playlist_observation;
                playlist.restrictionId = firstResult.playlist_restriction_id;
                playlist.ownerId = firstResult.playlist_owner_id;
            }
            
            // Add entries if they exist
            forEach(results, data => {
                if (data.entry_id) {
                    playlist.entries.push({
                        id: data.entry_id,
                        orderIndex: data.entry_order_index,
                        song: {
                            id: data.entry_song_id,
                        }
                    });
                }
            });

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
    
    const handler = server.createHandler({ path: '/api/get-playlist' });
    return handler(req, res);
}
