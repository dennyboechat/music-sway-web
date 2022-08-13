import { ApolloServer } from 'apollo-server-micro';
import { query } from '@/lib/db';
import { forEach } from 'lodash';
import { typeDefs } from '@/graphQl/type-definitions';
import { getSession } from 'next-auth/react';
import { getUserByEmail } from '@/lib/utils';

const resolvers = {
    Query: {
        playlist: async (root, { id }, context) => {

            const user = await getUserByEmail({ context, query });
            if (!user) {
                return null;
            }

            const results = await query(`
                SELECT 
                    playlist.id as playlistId, 
                    playlist.name as playlistName,
                    playlist.observation as playlistObservation,
                    playlist.restriction_id as playlistRestrictionId,
                    playlist.owner_id as playlistOwnerId,
                    playlist_entry.id as entryId, 
                    playlist_entry.song_id as entrySongId, 
                    playlist_entry.order_index as entryOrderIndex
                FROM 
                    playlist
                LEFT JOIN 
                    playlist_entry on playlist_entry.playlist_id = playlist.id
                WHERE 
                    playlist.id = ? AND
                    owner_id = ?
                `,
                [
                    id,
                    user.id
                ]
            );

            if (!results) {
                console.error('User cannot update this playlist.');
                return null;
            }

            let playlist = {
                entries: [],
            };
            forEach(results, data => {
                playlist.id = data.playlistId;
                playlist.name = data.playlistName;
                playlist.observation = data.playlistObservation;
                playlist.restrictionId = data.playlistRestrictionId;
                playlist.ownerId = data.playlistOwnerId;
                if (data.entryId) {
                    playlist.entries.push({
                        id: data.entryId,
                        orderIndex: data.entryOrderIndex,
                        song: {
                            id: data.entrySongId,
                        }
                    });
                }
            });

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

export default server.createHandler({ path: "/api/get-playlist" });
