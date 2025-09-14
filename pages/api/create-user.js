import { ApolloServer } from 'apollo-server-micro';
import { typeDefs } from '@/graphQl/type-definitions';
import { query } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { getSession } from 'next-auth/react';
import { authOptions } from './auth/[...nextauth]';

const resolvers = {
    Mutation: {
        addUser: async (root, { input: { name, email } }, context) => {

            if (!context) {
                return null;
            }

            if (!name || name.trim.length || !email || email.trim.length) {
                console.error('`name` and `email` are required.');
                return null;
            }

            let user = {
                name,
                email,
            }

            const results = await query(`
                INSERT INTO 
                    "user" (name, email)
                VALUES 
                    ($1, $2)
                RETURNING id
                `,
                [
                    user.name,
                    user.email,
                ]
            );

            user.id = results[0].id;

            return user;
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
    
    const handler = server.createHandler({ path: '/api/create-user' });
    return handler(req, res);
}