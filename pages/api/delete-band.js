import { ApolloServer } from 'apollo-server-micro';
import { typeDefs } from '@/graphQl/type-definitions';
import { query } from '@/lib/db';
import { getSession } from 'next-auth/react';
import { getUserByEmail } from '@/lib/utils';

const resolvers = {
    Mutation: {
        removeBand: async (root, { id }, context) => {

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
                    band
                WHERE 
                    id = ? AND
                    owner_id = ?
                `,
                [
                    id,
                    user.id
                ]
            );

            return { msg: `Band ${id} deleted.` };
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

export default server.createHandler({ path: '/api/delete-band' });