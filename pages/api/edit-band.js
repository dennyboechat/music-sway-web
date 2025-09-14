import { ApolloServer } from 'apollo-server-micro';
import { typeDefs } from '@/graphQl/type-definitions';
import { query } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { getSession } from 'next-auth/react';
import { authOptions } from './auth/[...nextauth]';
import { getUserByEmail } from '@/lib/utils';

const resolvers = {
    Mutation: {
        editBand: async (root, { input: { id, name, members } }, context) => {

            const user = await getUserByEmail({ context, query });
            if (!user) {
                return null;
            }

            if (!id || !name || !name.trim().length) {
                console.error('`id` and `name` are required.');
                return null;
            }

            let band = {
                id: id,
                name: name,
                ownerId: user.id,
            }

            let results = await query(`
                UPDATE 
                    band 
                SET 
                    name = $1
                WHERE 
                    id = $2 AND
                    owner_id = $3
                `,
                [
                    band.name,
                    band.id,
                    user.id
                ]
            );

            if (!results) {
                console.error('User cannot update this band.');
                return null;
            }

            results = await query(`
                DELETE FROM 
                    user_band
                WHERE 
                    band_id = $1
                `,
                [band.id]
            );

            if (members && members.length) {
                for (let i = 0; i < members.length; i++) {
                    const member = members[i];
                    await query(`
                        INSERT INTO 
                            user_band (band_id, user_invitation_email, band_user_status_id)
                        VALUES 
                            ($1, $2, $3)
                        `,
                        [band.id, member.invitationEmail, member.status]
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
    
    const handler = server.createHandler({ path: '/api/edit-band' });
    return handler(req, res);
}