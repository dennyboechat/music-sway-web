import { ApolloServer } from 'apollo-server-micro';
import { typeDefs } from '@/graphQl/type-definitions';
import { query } from '@/lib/db';

const resolvers = {
    Mutation: {
        editPlaylist: async (root, { input: { id, name, observation, restrictionId, entries } }) => {

            if (!id || !name || name.trim.length) {
                console.error('`id` and `name` are required.');
                return null;
            }

            let playlist = {
                id: id,
                name: name,
                observation: observation,
                restrictionId: restrictionId,
                ownerId: 1,
            }

            let results = await query(`
                UPDATE 
                    playlist 
                SET 
                    name = ?, 
                    observation = ?,
                    restriction_id = ?
                WHERE 
                    id = ?
                `,
                [playlist.name, playlist.observation, playlist.restrictionId, playlist.id]
            );

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

const server = new ApolloServer({ typeDefs, resolvers });

export default server.createHandler({ path: "/api/edit-playlist" });