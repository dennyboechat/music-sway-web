import { ApolloServer } from 'apollo-server-micro';
import { typeDefs } from '@/graphQl/type-definitions';
import { query, db } from '@/lib/db';
import { getSession } from 'next-auth/react';
import { getUserByEmail } from '@/lib/utils';
import { NextApiRequest, NextApiResponse } from 'next';

const resolvers = {
    Mutation: {
        addSongs: async (root: any, { ids }: { ids: string | string[] }, context: any) => {
            const user = await getUserByEmail({ context, query });
            if (!user) {
                return null;
            }

            if (!ids) {
                console.error('`ids` is required.');
                return null;
            }

            if (typeof ids === 'string') {
                ids = ids.split(',');
            }

            ids.forEach(async (songId: string) => {
                await db.transaction()
                    .query(
                        `
                        INSERT INTO
                            song (title, artist, category, observation, restriction_id, owner_id)
                        SELECT
                            title,
                            artist,
                            category,
                            observation,
                            restriction_id,
                            ?
                        FROM
                            song
                        WHERE
                            id = ?
                        `,
                        [user.id, songId]
                    )
                    .query((r: { insertId: number }) => [
                        `
                        INSERT INTO
                            song_entry (title, content, song_id)
                        SELECT
                            title,
                            content,
                            ?
                        FROM
                            song_entry
                        WHERE
                            song_id = ?
                        `,
                        [r.insertId, songId]
                    ])
                    .commit();
                await db.end();
            });

            return { msg: `Songs ${ids} copied.` };
        }
    }
};

const apolloServerConfig = {
    typeDefs,
    resolvers,
    context: async ({ req }: { req: NextApiRequest }): Promise<any> => {
        const session = await getSession({ req });
        return { session };
    },
};

const server = new ApolloServer(apolloServerConfig);

export const config = {
    api: {
        bodyParser: false,
    },
};

export default server.createHandler({ path: '/api/copy-songs' });
