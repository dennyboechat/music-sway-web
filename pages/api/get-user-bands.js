import { ApolloServer } from 'apollo-server-micro';
import { query } from '@/lib/db';
import { forEach } from 'lodash';
import { typeDefs } from '@/graphQl/type-definitions';
import { getSession } from 'next-auth/react';
import { getUserByEmail } from '@/lib/utils';

const resolvers = {
    Query: {
        bands: async (root, { }, context) => {
            try {
                const user = await getUserByEmail({ context, query });
                if (!user) {
                    return null;
                }

                const results = await query(`
                    SELECT 
                        band.id, 
                        band.name,
                        band.owner_id,
                        user_band.id as member_id, 
                        user_band.user_invitation_email as member_invitation_email, 
                        user_band.band_user_status_id as member_status_id,
                        "user".name as owner_name
                    FROM 
                        band
                    LEFT JOIN 
                        user_band ON user_band.band_id = band.id
                    LEFT JOIN
                        "user" ON "user".id = band.owner_id
                    WHERE 
                        band.owner_id = $1
                    `,
                    [user.id]
                )

                let bands = [];
                forEach(results, data => {
                    let band = bands.find(e => e.id === data.id);
                    if (!band) {
                        band = {
                            id: data.id,
                            name: data.name,
                            ownerId: data.owner_id,
                            members: [],
                        }
                        bands.push(band);
                    }
                    if (data.member_id) {
                        band.members.push({
                            id: data.member_id,
                            invitationEmail: data.member_invitation_email,
                            status: data.member_status_id
                        });
                    }
                });

                return bands;
            } catch (error) {
                console.error('Error in bands resolver:', error);
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
    
    const handler = server.createHandler({ path: '/api/get-user-bands' });
    return handler(req, res);
}
