import { ApolloServer } from 'apollo-server-micro';
import { typeDefs } from '@/graphQl/type-definitions';
import { query } from '@/lib/db';

const resolvers = {
    Mutation: {
        removePlaylist: async (root, { id }) => {

            if (!id) {
                console.error('`id` is required.');
                return null;
            }

            if (typeof parseInt(id.toString()) !== 'number') {
                console.error('`id` must be a number.');
                return null;
            }

            await query(`
                DELETE FROM 
                    playlist
                WHERE 
                    id = ?
                `,
                id
            );

            return { msg: `Playlist ${id} deleted.` };
        }
    }
};

export const config = {
    api: {
        bodyParser: false,
    },
}

const server = new ApolloServer({ typeDefs, resolvers });

export default server.createHandler({ path: "/api/delete-playlist" });