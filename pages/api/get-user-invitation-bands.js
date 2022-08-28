import { ApolloServer } from 'apollo-server-micro';
import { query } from '@/lib/db';
import { forEach } from 'lodash';
import { typeDefs } from '@/graphQl/type-definitions';
import { getSession } from 'next-auth/react';
import { getUserByEmail } from '@/lib/utils';

const resolvers = {
    Query: {
        userInvitationBands: async (root, { }, context) => {

            const user = await getUserByEmail({ context, query });
            if (!user) {
                return null;
            }

            const results = await query(`
                SELECT 
                    band.id as bandId, 
                    band.name as bandName,
                    band.owner_id as bandOwnerId,
                    user_band.id as bandMemberId, 
                    user_band.user_invitation_email as bandMemberInvitationEmail, 
                    user_band.band_user_status_id as bandMemberStatusId
                FROM 
                    band
                LEFT JOIN 
                    user_band on user_band.band_id = band.id
                WHERE 
                    user_band.user_invitation_email = ?
                `,
                [user.email]
            )

            let bands = [];
            forEach(results, data => {
                let band = bands.find(e => e.id === data.bandId);
                if (!band) {
                    band = {
                        id: data.bandId,
                        name: data.bandName,
                        ownerId: data.bandOwnerId,
                        members: [],
                    }
                    bands.push(band);
                }
                if (data.bandMemberId) {
                    band.members.push({
                        id: data.bandMemberId,
                        invitationEmail: data.bandMemberInvitationEmail,
                        status: data.bandMemberStatusId
                    });
                }
            });

            return bands;
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

export default server.createHandler({ path: "/api/get-user-invitation-bands" });
