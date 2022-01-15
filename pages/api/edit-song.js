import { ApolloServer } from 'apollo-server-micro';
import { typeDefs } from '@/graphQl/type-definitions';
import { query } from '@/lib/db';

const resolvers = {
    Mutation: {
        editSong: async (root, { input: { id, title, artist, category, observation, entries } }) => {

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
            }

            let results = await query(`
                UPDATE 
                    song 
                SET 
                    title = ?, 
                    artist = ?, 
                    category = ?, 
                    observation = ?
                WHERE 
                    id = ?
                `,
                [song.title, song.artist, song.category, song.observation, song.id]
            );

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

const server = new ApolloServer({ typeDefs, resolvers });

export default server.createHandler({ path: "/api/edit-song" });