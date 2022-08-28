import { gql } from "graphql-request";

export const createUser = gql`
  mutation ($input: UserAddInput!) {
    addUser(input: $input) {
      id,
      name,
      email,
    }
  }
`;

export const createSong = gql`
  mutation ($input: SongAddInput!) {
    addSong(input: $input) {
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
      },
    }
  }
`;

export const updateSong = gql`
  mutation ($input: SongUpdateInput!) {
    editSong(input: $input) {
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
      },
    }
  }
`;

export const deleteSong = gql`
  mutation ($id: ID!) {
    removeSong(id: $id) {
      msg,
    }
  }
`;

export const createPlaylist = gql`
  mutation ($input: PlaylistAddInput!) {
    addPlaylist(input: $input) {
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
      },
    }
  }
`;

export const updatePlaylist = gql`
  mutation ($input: PlaylistUpdateInput!) {
    editPlaylist(input: $input) {
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
      },
    }
  }
`;

export const deletePlaylist = gql`
  mutation ($id: ID!) {
    removePlaylist(id: $id) {
      msg,
    }
  }
`;

export const createBand = gql`
  mutation ($input: BandAddInput!) {
    addBand(input: $input) {
      id,
      name,
      members {
        id,
        invitationEmail,
        status,
      },
    }
  }
`;

export const updateBand = gql`
  mutation ($input: BandUpdateInput!) {
    editBand(input: $input) {
      id,
      name,
      members {
        id,
        invitationEmail,
        status,
      },
    }
  }
`;

export const deleteBand = gql`
  mutation ($id: ID!) {
    removeBand(id: $id) {
      msg,
    }
  }
`;

export const updateUserInvitationBand = gql`
  mutation ($input: UserInvitationBandInput!) {
    editUserInvitationBand(input: $input) {
      bandId,
      userId,
      invitationStatus,
    }
  }
`;