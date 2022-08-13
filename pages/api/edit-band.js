import { ApolloServer } from 'apollo-server-micro';
import { typeDefs } from '@/graphQl/type-definitions';
import { query } from '@/lib/db';
import { getSession } from 'next-auth/react';
import { getUserByEmail } from '@/lib/utils';

const resolvers = {
    Mutation: {
        editBand: async (root, { input: { id, name, members } }, context) => {

            const user = await getUserByEmail({ context, query });
            if (!user) {
                return null;
            }

            if (!id || !name || name.trim.length) {
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
                    name = ?
                WHERE 
                    id = ? AND
                    owner_id = ?
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
                    band_id = ?
                `,
                [band.id]
            );

            if (members && members.length) {
                const memberRows = members.map(member => [band.id, member.invitationEmail, member.status]);
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

export default server.createHandler({ path: "/api/edit-band" });