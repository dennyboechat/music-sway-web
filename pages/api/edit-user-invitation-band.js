import { ApolloServer } from 'apollo-server-micro';
import { typeDefs } from '@/graphQl/type-definitions';
import { query } from '@/lib/db';
import { getSession } from 'next-auth/react';
import { getUserByEmail } from '@/lib/utils';

const resolvers = {
    Mutation: {
        editUserInvitationBand: async (root, { input: { bandId, invitationStatus } }, context) => {

            const user = await getUserByEmail({ context, query });
            if (!user) {
                return null;
            }

            if (!bandId || !invitationStatus) {
                console.error('`bandId` and `invitationStatus` are required.');
                return null;
            }

            let results = await query(`
                UPDATE 
                    user_band 
                SET 
                    user_id = ?,
                    band_user_status_id = ?
                WHERE 
                    band_id = ? AND
                    user_invitation_email = ?
                `,
                [
                    user.id,
                    invitationStatus,
                    bandId,
                    user.email
                ]
            );

            if (!results) {
                console.error('User cannot update this band invitation.');
                return null;
            }

            return {
                bandId: bandId,
                userId: user.id,
                invitationStatus: invitationStatus
            };
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

export default server.createHandler({ path: '/api/edit-user-invitation-band' });