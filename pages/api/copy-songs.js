import { ApolloServer } from 'apollo-server-micro';
import { typeDefs } from '@/graphQl/type-definitions';
import { query, db } from '@/lib/db';
import { getSession } from 'next-auth/react';
import { getUserByEmail } from '@/lib/utils';

const resolvers = {
    Mutation: {
        addSongs: async (root, { ids }, context) => {

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

            ids.forEach(async (songId) => {
                await db.transaction()
                    .query(`
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
                        [
                            user.id,
                            songId,
                        ]
                    )
                    .query((r) => [`
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
                        `
                        , [
                            r.insertId,
                            songId
                        ]
                    ])
                    .commit();
                await db.end();
            });

            return { msg: `Songs ${ids} copied.` };
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

export default server.createHandler({ path: "/api/copy-songs" });