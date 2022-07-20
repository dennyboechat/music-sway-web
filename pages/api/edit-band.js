import { ApolloServer } from 'apollo-server-micro';
import { typeDefs } from '@/graphQl/type-definitions';
import { query } from '@/lib/db';

const resolvers = {
    Mutation: {
        editBand: async (root, { input: { id, name, members } }) => {

            if (!id || !name || name.trim.length) {
                console.error('`id` and `name` are required.');
                return null;
            }

            let band = {
                id: id,
                name: name,
            }

            let results = await query(`
                UPDATE 
                    band 
                SET 
                    name = ?
                WHERE 
                    id = ?
                `,
                [band.name, band.id]
            );

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

const server = new ApolloServer({ typeDefs, resolvers });

export default server.createHandler({ path: "/api/edit-band" });