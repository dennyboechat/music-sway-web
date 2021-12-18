import { gql } from "graphql-request";

export const songsQuery = gql`
  query {
    songs {
      id 
      title 
      artist
      category
      observation
      entries { 
        id
        title
        content
      }
    }
  }
`;

export const songQuery = gql`
  query($id: ID!) {
    song(id: $id) {
      id 
      title 
      artist
      category
      observation
      entries { 
        id
        title
        content
      }
    }
  }
`;