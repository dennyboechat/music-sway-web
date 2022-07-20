import { ApolloServer } from 'apollo-server-micro';
import { typeDefs } from '@/graphQl/type-definitions';
import { query } from '@/lib/db';

const resolvers = {
    Mutation: {
        addBand: async (root, { input: { name, members } }) => {

            if (!name || name.trim.length) {
                console.error('`name` is required.');
                return null;
            }

            let band = {
                name: name,
                ownerId: 1,
            }

            let results = await query(`
                INSERT INTO 
                    band (name, owner_id)
                VALUES 
                (?, ?)
                `,
                [band.name, band.ownerId]
            );

            const bandIdResults = await query(`
                SELECT 
                    LAST_INSERT_ID() as bandId
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

const server = new ApolloServer({ typeDefs, resolvers });

export default server.createHandler({ path: "/api/create-band" });