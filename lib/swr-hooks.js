import { request } from 'graphql-request';
import useSWR from 'swr';
import { songsQuery, songQuery } from '@/graphQl/queries';

export const useSongs = () => {
  const { data, error } = useSWR(songsQuery, query => request('/api/get-songs', query));
  return {
    songs: data ? data.songs : [],
    isLoadingSongs: !error && !data,
    isErrorLoadingSongs: error,
  }
}

export const useSong = (id) => {
  const { data, error } = useSWR(songQuery, query => request('/api/get-song', query, { id }));
  return {
    song: data ? data.song : null,
    isLoadingSong: !error && !data,
    isErrorLoadingSong: error,
  }
}
