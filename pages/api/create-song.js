import { ApolloServer } from 'apollo-server-micro';
import { typeDefs } from '@/graphQl/type-definitions';
import { query } from '@/lib/db';

const resolvers = {
  Mutation: {
    addSong: async (root, { input: { title, artist, category, observation, restrictionId, entries } }) => {

      if (!title || title.trim.length || !restrictionId) {
        console.error('`title` and `restriction id` are required.');
        return null;
      }

      let song = {
        title: title,
        artist: artist,
        category: category,
        observation: observation,
        restrictionId: restrictionId,
        ownerId: 1,
      }

      let results = await query(`
        INSERT INTO 
            song (title, artist, category, observation, restriction_id, owner_id)
        VALUES 
          (?, ?, ?, ?, ?, ?)
        `,
        [song.title, song.artist, song.category, song.observation, song.restrictionId, song.ownerId]
      );

      const songIdResults = await query(`
        SELECT 
            LAST_INSERT_ID() as songId
      `
      );
      song.id = songIdResults[0].songId;

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

export default server.createHandler({ path: "/api/create-song" });