import { gql } from "graphql-request";

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