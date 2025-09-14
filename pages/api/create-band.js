import { ApolloServer } from 'apollo-server-micro';
import { typeDefs } from '@/graphQl/type-definitions';
import { query } from '@/lib/db';
import { getSession } from 'next-auth/react';
import { getUserByEmail } from '@/lib/utils';

const resolvers = {
    Mutation: {
        addBand: async (root, { input: { name, members } }, context) => {

            const user = await getUserByEmail({ context, query });
            if (!user) {
                return null;
            }

            if (!name || name.trim.length) {
                console.error('`name` is required.');
                return null;
            }

            let band = {
                name: name,
                ownerId: user.id,
            }

            let results = await query(`
                INSERT INTO 
                    band (name, owner_id)
                VALUES 
                    ($1, $2)
                RETURNING id
                `,
                [
                    band.name,
                    band.ownerId,
                ]
            );

            band.id = results[0].id;

            if (members && members.length) {
                const pendingStatusId = 2;
                for (const member of members) {
                    await query(`
                        INSERT INTO 
                            user_band (band_id, user_invitation_email, band_user_status_id)
                        VALUES 
                            ($1, $2, $3)
                        `,
                        [band.id, member.invitationEmail, pendingStatusId]
                    );
                }
            }

            return band;
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
    
    const handler = server.createHandler({ path: '/api/create-band' });
    return handler(req, res);
}