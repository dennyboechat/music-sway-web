import { ApolloServer } from 'apollo-server-micro';
import { query } from '@/lib/db';
import { forEach } from 'lodash';
import { typeDefs } from '@/graphQl/type-definitions';
import { getSession } from 'next-auth/react';
import { getUserByEmail } from '@/lib/utils';

const resolvers = {
  Query: {
    song: async (root, { id }, context) => {

      const user = await getUserByEmail({ context, query });
      if (!user) {
        return null;
      }

      const results = await query(`
          SELECT 
            song.id AS songId, 
            song.title AS songTitle,
            song.artist AS songArtist,
            song.category AS songCategory,
            song.observation AS songObservation,
            song.restriction_id AS songRestrictionId,
            song.owner_id AS songOwnerId,
            song_entry.id AS entryId, 
            song_entry.title AS entryTitle, 
            song_entry.content AS entryContent,
            user.name AS ownerName
          FROM 
            song
          LEFT JOIN 
            song_entry ON song_entry.song_id = song.id
          LEFT JOIN
            user ON user.id = song.owner_id
          WHERE 
            song.id = ? AND
            song.owner_id = ?
          `,
        [
          id,
          user.id
        ]
      );

      if (!results) {
        console.error('User cannot get this song.');
        return null;
      }

      let song = {
        entries: [],
      };
      forEach(results, data => {
        song.id = data.songId;
        song.title = data.songTitle;
        song.artist = data.songArtist;
        song.category = data.songCategory;
        song.observation = data.songObservation;
        song.restrictionId = data.songRestrictionId;
        song.ownerId = data.songOwnerId;
        if (data.entryId) {
          song.entries.push({
            id: data.entryId,
            title: data.entryTitle,
            content: data.entryContent
          });
        }
      });

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

export default server.createHandler({ path: '/api/get-song' });
