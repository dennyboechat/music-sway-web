import { ApolloServer } from 'apollo-server-micro';
import { typeDefs } from '@/graphQl/type-definitions';
import { query } from '@/lib/db';
import { getSession } from 'next-auth/react';
import { getUserByEmail } from '@/lib/utils';

const resolvers = {
    Mutation: {
        editSong: async (root, { input: { id, title, artist, category, observation, restrictionId, entries } }, context) => {

            const user = await getUserByEmail({ context, query });
            if (!user) {
                return null;
            }

            if (!id || !title || title.trim.length) {
                console.error('`id` and `title` are required.');
                return null;
            }

            let song = {
                id: id,
                title: title,
                artist: artist,
                category: category,
                observation: observation,
                restrictionId: restrictionId,
                ownerId: user.id,
            }

            let results = await query(`
                UPDATE 
                    song 
                SET 
                    title = ?, 
                    artist = ?, 
                    category = ?, 
                    observation = ?,
                    restriction_id = ?
                WHERE 
                    id = ? AND
                    owner_id = ?
                `,
                [
                    song.title,
                    song.artist,
                    song.category,
                    song.observation,
                    song.restrictionId,
                    song.id,
                    user.id
                ]
            );

            if (!results) {
                console.error('User cannot update this song.');
                return null;
            }

            results = await query(`
                DELETE FROM 
                    song_entry
                WHERE 
                    song_id = ?
                `,
                [song.id]
            );

            if (entries && entries.length) {
                const entryRows = entries.map(entry => [entry.title, entry.content, song.id]);
                results = await query(`
                    INSERT INTO 
                        song_entry (title, content, song_id)
                    VALUES 
                        ?
                    `,
                    [entryRows]
                );
            }

            return song;
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

export default server.createHandler({ path: '/api/edit-song' });