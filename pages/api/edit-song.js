import { ApolloServer } from 'apollo-server-micro';
import { typeDefs } from '@/graphQl/type-definitions';
import { query } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { getSession } from 'next-auth/react';
import { authOptions } from './auth/[...nextauth]';
import { getUserByEmail } from '@/lib/utils';

const resolvers = {
    Mutation: {
        editSong: async (root, { input: { id, title, artist, category, observation, restrictionId, entries } }, context) => {

            const user = await getUserByEmail({ context, query });
            if (!user) {
                return null;
            }

            if (!id || !title || title.trim().length === 0) {
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
                    title = $1, 
                    artist = $2, 
                    category = $3, 
                    observation = $4,
                    restriction_id = $5
                WHERE 
                    id = $6 AND
                    owner_id = $7
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
                    song_id = $1
                `,
                [song.id]
            );

            if (entries && entries.length) {
                for (const entry of entries) {
                    results = await query(`
                        INSERT INTO 
                            song_entry (title, content, song_id)
                        VALUES 
                            ($1, $2, $3)
                        `,
                        [entry.title, entry.content, song.id]
                    );
                }
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
    
    const handler = server.createHandler({ path: '/api/edit-song' });
    return handler(req, res);
}