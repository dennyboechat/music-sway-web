import { gql } from 'apollo-server-micro';

const typeDefs = gql`

    type SongEntry {
        id: ID!
        title: String
        content: String
    }

    type Song {
        id: ID!
        title: String!
        artist: String
        category: String
        observation: String
        entries: [SongEntry]
    }

    type Query {
        song(id: ID!): Song
        songs: [Song]
    }
`;

module.exports = { typeDefs };