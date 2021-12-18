import { request } from 'graphql-request';
import useSWR from 'swr';
import { songsQuery, songQuery } from '../graphQl/queries'

export function useSongs() {
  const { data, error } = useSWR(songsQuery, query => request('/api/get-songs', query));
  return {
    songs: data ? data.songs : [],
    isLoadingSongs: !error && !data,
    isErrorLoadingSongs: error,
  }
}

export function useSong(id) {
  const { data, error } = useSWR(songQuery, query => request('/api/get-song', query, { id }));
  return {
    song: data ? data.song : null,
    isLoadingSong: !error && !data,
    isErrorLoadingSong: error,
  }
}
