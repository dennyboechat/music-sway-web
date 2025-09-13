import { ApolloServer } from 'apollo-server-micro';
import { query } from '@/lib/db'
import { forEach } from 'lodash';
import { typeDefs } from '@/graphQl/type-definitions';
import { getSession } from 'next-auth/react';
import { getUserByEmail } from '@/lib/utils';

const resolvers = {
    Query: {
        bandsSongs: async (roots, { }, context) => {
            try {
                const user = await getUserByEmail({ context, query });
                if (!user) {
                    return null;
                }

                const results = await query(`
                    SELECT 
                        song.id, 
                        song.title,
                        song.artist,
                        song.category,
                        song.observation,
                        song.restriction_id,
                        song.owner_id,
                        song_entry.id as entry_id, 
                        song_entry.title as entry_title, 
                        song_entry.content as entry_content,
                        "user".name as owner_name
                    FROM 
                        song
                    INNER JOIN
                        "user" ON "user".id = song.owner_id
                    LEFT JOIN 
                        song_entry ON song_entry.song_id = song.id
                    LEFT JOIN
                        user_band ON user_band.user_id = song.owner_id
                    LEFT JOIN
                        band ON band.id = user_band.band_id OR 
                        band.owner_id = song.owner_id
                    WHERE
                        song.owner_id <> $1 AND
                        song.restriction_id IN (2, 3) AND
                        (
                            band.owner_id = $2 OR
                            (
                                SELECT
                                    user_band_subSelect.id
                                FROM 
                                    user_band AS user_band_subSelect
                                WHERE 
                                    user_band_subSelect.band_id = band.id AND
                                    user_band_subSelect.band_user_status_id = 1 AND 
                                    user_band_subSelect.user_id = $3
                            ) IS NOT NULL
                        )
                    ORDER BY 
                        song.id DESC
                    `,
                    [
                        user.id,
                        user.id,
                        user.id,
                    ]
                );

                let songs = []
                forEach(results, data => {
                    let song = songs.find(e => e.id === data.id);
                    if (!song) {
                        song = {
                            id: data.id,
                            title: data.title,
                            artist: data.artist,
                            category: data.category,
                            observation: data.observation,
                            restrictionId: data.restriction_id,
                            ownerId: data.owner_id,
                            ownerName: data.owner_name,
                            entries: [],
                        }
                        songs.push(song);
                    }
                    if (data.entry_id) {
                        song.entries.push({
                            id: data.entry_id,
                            title: data.entry_title,
                            content: data.entry_content
                        });
                    }
                });

                return songs;
            } catch (error) {
                console.error('Error in bandsSongs resolver:', error);
                throw error;
            }
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

export default server.createHandler({ path: '/api/get-bands-songs' });