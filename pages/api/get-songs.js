import { ApolloServer } from 'apollo-server-micro';
import { query } from '@/lib/db'
import { getNewSong } from '@/lib/utils';
import { forEach } from 'lodash';
import { typeDefs } from '@/graphQl/type-definitions';

const resolvers = {
  Query: {
    songs: async () => {
      const results = await query(`
          SELECT 
            song.id as songId, 
            song.title as songTitle,
            song.artist as songArtist,
            song.category as songCategory,
            song.observation as songObservation,
            song.restriction_id as songRestrictionId,
            song.owner_id as songOwnerId,
            song_entry.id as entryId, 
            song_entry.title as entryTitle, 
            song_entry.content as entryContent
          FROM 
            song
          LEFT JOIN 
            song_entry on song_entry.song_id = song.id
          ORDER BY 
            song.id DESC
      `)

      let songs = []
      forEach(results, data => {
        let song = songs.find(e => e.id === data.songId);
        if (!song) {
          song = getNewSong({ addEntry: false });
          song.id = data.songId;
          song.title = data.songTitle;
          song.artist = data.songArtist;
          song.category = data.songCategory;
          song.observation = data.songObservation;
          song.restrictionId = data.songRestrictionId;
          song.ownerId = data.ownerId;
          songs.push(song);
        }
        if (data.entryId) {
          song.entries.push({ id: data.entryId, title: data.entryTitle, content: data.entryContent });
        }
      });

      return songs;
    }
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
}

const server = new ApolloServer({ typeDefs, resolvers });

export default server.createHandler({ path: "/api/get-songs" });