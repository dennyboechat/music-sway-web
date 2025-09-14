import { ApolloServer } from 'apollo-server-micro';
import { typeDefs } from '@/graphQl/type-definitions';
import { query } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { getSession } from 'next-auth/react';
import { authOptions } from './auth/[...nextauth]';
import { getUserByEmail } from '@/lib/utils';

const resolvers = {
    Mutation: {
        removeSong: async (root, { id }, context) => {

            const user = await getUserByEmail({ context, query });
            if (!user) {
                return null;
            }

            if (!id) {
                console.error('`id` is required.');
                return null;
            }

            if (typeof parseInt(id.toString()) !== 'number') {
                console.error('`id` must be a number.');
                return null;
            }

            await query(`
                DELETE FROM 
                    song
                WHERE 
                    id = $1 AND
                    owner_id = $2
                `,
                [
                    id,
                    user.id
                ]
            );

            return { msg: `Song ${id} deleted.` };
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
    
    const handler = server.createHandler({ path: '/api/delete-song' });
    return handler(req, res);
}