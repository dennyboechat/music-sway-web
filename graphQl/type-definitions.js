import { gql } from 'apollo-server-micro';

const typeDefs = gql`

    input UserAddInput {
        name: String
        email: String
    }

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

    input UserInvitationBandInput {
        bandId: ID!
        invitationStatus: ID!
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
        ownerName: String
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
        ownerName: String
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
        ownerName: String
        members: [BandMember]
    }

    type UserInvitationBand {
        bandId: ID!
        userId: ID!
        invitationStatus: ID!
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

    type Query {
        user(email: String!): User
        song(id: ID!): Song
        songs: [Song]
        bandsSongs: [Song]
        playlist(id: ID!): Playlist
        playlists: [Playlist]
        bands: [Band]
        userInvitationBands: [Band]
    }

    type Mutation {
        addUser(input: UserAddInput!): User,
        addSong(input: SongAddInput!): Song,
        editSong(input: SongUpdateInput!): Song,
        removeSong(id: ID!): SongDeleted,
        addPlaylist(input: PlaylistAddInput!): Playlist,
        editPlaylist(input: PlaylistUpdateInput!): Playlist,
        removePlaylist(id: ID!): PlaylistDeleted,
        addBand(input: BandAddInput!): Band,
        editBand(input: BandUpdateInput!): Band,
        removeBand(id: ID!): BandDeleted,
        editUserInvitationBand(input: UserInvitationBandInput!): UserInvitationBand,
    }
`;

module.exports = { typeDefs };