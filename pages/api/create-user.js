import { ApolloServer } from 'apollo-server-micro';
import { typeDefs } from '@/graphQl/type-definitions';
import { query } from '@/lib/db';
import { getSession } from 'next-auth/react';

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

            await query(`
                INSERT INTO 
                    user (name, email)
                VALUES 
                    (?, ?)
                `,
                [
                    user.name,
                    user.email,
                ]
            );

            const userIdResults = await query(`
                SELECT 
                    LAST_INSERT_ID() AS userId
            `
            );
            user.id = userIdResults[0].userId;

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
    context: async ({ req }) => {
        const session = await getSession({ req });
        return { session };
    },
});

export default server.createHandler({ path: "/api/create-user" });