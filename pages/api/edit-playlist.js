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

            if (!id || !name || !name.trim().length) {
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
                    name = $1, 
                    observation = $2,
                    restriction_id = $3
                WHERE 
                    id = $4 AND
                    owner_id = $5
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
                    playlist_id = $1
                `,
                [playlist.id]
            );

            if (entries && entries.length) {
                for (let i = 0; i < entries.length; i++) {
                    const entry = entries[i];
                    await query(`
                        INSERT INTO 
                            playlist_entry (song_id, order_index, playlist_id)
                        VALUES 
                            ($1, $2, $3)
                        `,
                        [entry.songId, entry.orderIndex, playlist.id]
                    );
                }
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

export default async function graphqlHandler(req, res) {
    if (!server.startedPromise) {
        server.startedPromise = server.start();
    }
    await server.startedPromise;
    
    const handler = server.createHandler({ path: '/api/edit-playlist' });
    return handler(req, res);
}