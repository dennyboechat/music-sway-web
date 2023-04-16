import { ApolloServer } from 'apollo-server-micro';
import { query } from '@/lib/db';
import { forEach } from 'lodash';
import { typeDefs } from '@/graphQl/type-definitions';

const resolvers = {
    Query: {
        user: async (root, { email }) => {
            if (!email) {
                return null;
            }
            const results = await query(`
                SELECT 
                    user.id AS userId, 
                    user.name AS userName,
                    user.email AS userEmail
                FROM 
                    user
                WHERE 
                    user.email = ?
                `,
                email
            )

            let user;
            forEach(results, data => {
                user = {
                    id: data.userId,
                    name: data.userName,
                    email: data.userEmail,
                }
            });

            return user;
        }
    }
};

export const config = {
    api: {
        bodyParser: false,
    },
}

const server = new ApolloServer({ typeDefs, resolvers });

export default server.createHandler({ path: '/api/get-user' });
