import { gql } from 'apollo-server-micro';

const typeDefs = gql`

    input SongEntryInput {
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
        id: ID!
        title: String!
        artist: String
        category: String
        observation: String
        restrictionId: Int
        entries: [SongEntryInput]
    }

    input PlaylistEntryInput {
        songId: ID!
        orderIndex: Int!
    }

    input PlaylistAddInput {
        name: String!
        observation: String
        restrictionId: Int
        entries: [PlaylistEntryInput]
    }

    input PlaylistUpdateInput {
        id: ID!
        name: String!
        observation: String
        restrictionId: Int
        entries: [PlaylistEntryInput]
    }

    type User {
        id: ID!
        name: String!
        email: String!
    }

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
        restrictionId: Int
        ownerId: Int
        entries: [SongEntry]
    }

    type PlaylistEntry {
        id: ID!
        orderIndex: Int!
        song: Song!
    }

    type Playlist {
        id: ID!
        name: String!
        observation: String
        restrictionId: Int
        ownerId: Int
        entries: [PlaylistEntry]
    }

    input BandMembersInput {
        invitationEmail: String!
        status: ID
    }

    input BandAddInput {
        name: String!
        members: [BandMembersInput]
    }

    input BandUpdateInput {
        id: ID!
        name: String!
        members: [BandMembersInput]
    }

    type BandMember {
        id: ID!
        userId: ID
        invitationEmail: String!
        status: String!
    }

    type Band {
        id: ID!
        name: String!
        ownerId: Int
        members: [BandMember]
    }

    type Query {
        user(email: String!): User
        song(id: ID!): Song
        songs: [Song]
        playlist(id: ID!): Playlist
        playlists: [Playlist]
        bands: [Band]
    }

    type SongDeleted {
        msg: String,
    }

    type PlaylistDeleted {
        msg: String,
    }

    type BandDeleted {
        msg: String,
    }

    type Mutation {
        addSong(input: SongAddInput!): Song,
        editSong(input: SongUpdateInput!): Song,
        removeSong(id: ID!): SongDeleted,
        addPlaylist(input: PlaylistAddInput!): Playlist,
        editPlaylist(input: PlaylistUpdateInput!): Playlist,
        removePlaylist(id: ID!): PlaylistDeleted,
        addBand(input: BandAddInput!): Band,
        editBand(input: BandUpdateInput!): Band,
        removeBand(id: ID!): BandDeleted,
    }
`;

module.exports = { typeDefs };