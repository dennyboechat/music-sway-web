import { ApolloServer } from 'apollo-server-micro';
import { query } from '@/lib/db';
import { forEach } from 'lodash';
import { typeDefs } from '@/graphQl/type-definitions';

const resolvers = {
    Query: {
        user: async (root, { email }) => {
            try {
                if (!email) {
                    return null;
                }
                
                const results = await query(`
                    SELECT 
                        id, 
                        name,
                        email
                    FROM 
                        "user"
                    WHERE 
                        email = $1
                    `,
                    [email]
                )

                if (results.length === 0) {
                    return null;
                }

                const data = results[0];
                
                // Ensure all required fields have valid values
                if (!data.id || !data.email) {
                    throw new Error(`Missing required user data. id: ${data.id}, email: ${data.email}`);
                }
                
                // Handle nullable name field - use empty string if null
                const userName = data.name || '';
                
                return {
                    id: data.id.toString(),
                    name: userName,
                    email: data.email,
                };
            } catch (error) {
                console.error('Error in user query:', error);
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

const server = new ApolloServer({ typeDefs, resolvers });

export default async function graphqlHandler(req, res) {
    if (!server.startedPromise) {
        server.startedPromise = server.start();
    }
    await server.startedPromise;
    
    const handler = server.createHandler({ path: '/api/get-user' });
    return handler(req, res);
}
