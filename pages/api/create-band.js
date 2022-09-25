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
                    (?, ?)
                `,
                [
                    band.name, 
                    band.ownerId,
                ]
            );

            const bandIdResults = await query(`
                SELECT 
                    LAST_INSERT_ID() AS bandId
            `
            );
            band.id = bandIdResults[0].bandId;

            if (members && members.length) {
                const pendingStatusId = 2;
                const memberRows = members.map(member => [band.id, member.invitationEmail, pendingStatusId]);
                results = await query(`
                    INSERT INTO 
                        user_band (band_id, user_invitation_email, band_user_status_id)
                    VALUES 
                        ?
                    `,
                    [memberRows]
                );
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

export default server.createHandler({ path: "/api/create-band" });