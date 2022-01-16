import { gql } from 'apollo-server-micro';

const typeDefs = gql`

    input SongEntryInput {
        title: String
        content: String
    }

    type SongEntry {
        id: ID!
        title: String
        content: String
    }

    input SongAddInput {
        title: String!
        artist: String
        category: String
        observation: String
        restrictionId: Int
        entries: [SongEntryInput]
    }

    input SongUpdateInput {
        id: ID!,
        title: String!
        artist: String
        category: String
        observation: String
        restrictionId: Int
        entries: [SongEntryInput]
    }

    type Song {
        id: ID!
        title: String!
        artist: String
        category: String
        observation: String
        restrictionId: Int
        ownerId: Int
        entries: [SongEntry]
    }

    type Query {
        song(id: ID!): Song
        songs: [Song]
    }

    type SongDeleted {
        msg: String,
    }

    type Mutation {
        addSong(input: SongAddInput!): Song,
        editSong(input: SongUpdateInput!): Song,
        removeSong(id: ID!): SongDeleted,
    }
`;

module.exports = { typeDefs };