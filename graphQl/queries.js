import { gql } from "graphql-request";

export const songsQuery = gql`
  query {
    songs {
      id,
      title,
      artist,
      category,
      observation,
      restrictionId,
      ownerId,
      entries { 
        id,
        title,
        content,
      }
    }
  }
`;

export const songQuery = gql`
  query($id: ID!) {
    song(id: $id) {
      id,
      title, 
      artist,
      category,
      observation,
      restrictionId,
      ownerId,
      entries { 
        id,
        title,
        content,
      }
    }
  }
`;

export const playlistsQuery = gql`
  query {
    playlists {
      id,
      name,
      observation,
      restrictionId,
      ownerId,
      entries {
        id,
        orderIndex,
        song {
          id,
          title,
          artist,
          category,
          observation,
          restrictionId,
          ownerId,
          entries { 
            id,
            title,
            content,
          }
        }
      }
    }
  }
`;

export const playlistQuery = gql`
  query($id: ID!) {
    playlist(id: $id) {
      id,
      name, 
      observation,
      restrictionId,
      ownerId,
      entries { 
        id,
        orderIndex,
        song {
          id
        }
      }
    }
  }
`;

export const bandsQuery = gql`
  query {
    bands {
      id,
      name,
      ownerId,
      members {
        id,
        invitationEmail,
        status,
      }
    }
  }
`;

export const userInvitationBandsQuery = gql`
  query {
    userInvitationBands {
      id,
      name,
      ownerId,
      members {
        id,
        invitationEmail,
        status,
      }
    }
  }
`;