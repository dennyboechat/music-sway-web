import { ApolloServer } from 'apollo-server-micro';
import { typeDefs } from '@/graphQl/type-definitions';
import { query } from '@/lib/db';
import { getSession } from 'next-auth/react';
import { getUserByEmail } from '@/lib/utils';

const resolvers = {
    Mutation: {
        editPlaylist: async (root, { input: { id, name, observation, restrictionId, entries } }, context) => {

            const user = await getUserByEmail({ context, query });
            if (!user) {
                return null;
            }

            if (!id || !name || name.trim.length) {
                console.error('`id` and `name` are required.');
                return null;
            }

            let playlist = {
                id: id,
                name: name,
                observation: observation,
                restrictionId: restrictionId,
            }

            let results = await query(`
                UPDATE 
                    playlist 
                SET 
                    name = ?, 
                    observation = ?,
                    restriction_id = ?
                WHERE 
                    id = ? AND
                    owner_id = ?
                `,
                [
                    playlist.name,
                    playlist.observation,
                    playlist.restrictionId,
                    playlist.id,
                    user.id
                ]
            );

            if (!results) {
                console.error('User cannot update this playlist.');
                return null;
            }

            results = await query(`
                DELETE FROM 
                    playlist_entry
                WHERE 
                    playlist_id = ?
                `,
                [playlist.id]
            );

            if (entries && entries.length) {
                const entryRows = entries.map(entry => [entry.songId, entry.orderIndex, playlist.id]);
                results = await query(`
                    INSERT INTO 
                        playlist_entry (song_id, order_index, playlist_id)
                    VALUES 
                        ?
                    `,
                    [entryRows]
                );
            }

            return playlist;
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

export default server.createHandler({ path: '/api/edit-playlist' });