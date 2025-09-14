import { request } from 'graphql-request';
import useSWRImmutable from 'swr/immutable';
import {
  songsQuery,
  bandsSongsQuery,
  songQuery,
  playlistsQuery,
  playlistQuery,
  bandsQuery,
  userInvitationBandsQuery,
} from '@/graphQl/queries';

export const useSongs = () => {
  const { data, error } = useSWRImmutable(songsQuery, query => request('/api/get-songs', query));
  return {
    songs: data ? (data as any).songs : [],
    isLoadingSongs: !error && !data,
    isErrorLoadingSongs: error,
  }
}

export const useBandsSongs = () => {
  const { data, error } = useSWRImmutable(bandsSongsQuery, query => request('/api/get-bands-songs', query));
  return {
    bandsSongs: data ? (data as any).bandsSongs : [],
    isLoadingBandsSongs: !error && !data,
    isErrorLoadingBandsSongs: error,
  }
}

export const useSong = (id: number) => {
  const { data, error } = useSWRImmutable(songQuery, query => request('/api/get-song', query, { id }));
  return {
    song: data ? (data as any).song : null,
    isLoadingSong: !error && !data,
    isErrorLoadingSong: error,
  }
}

export const usePlaylists = () => {
  const { data, error } = useSWRImmutable(playlistsQuery, query => request('/api/get-playlists', query));
  return {
    playlists: data ? (data as any).playlists : [],
    isLoadingPlaylists: !error && !data,
    isErrorLoadingPlaylists: error,
  }
}

export const usePlaylist = (id: number) => {
  const { data, error } = useSWRImmutable(playlistQuery, query => request('/api/get-playlist', query, { id }));
  return {
    playlist: data ? (data as any).playlist : null,
    isLoadingPlaylist: !error && !data,
    isErrorLoadingPlaylist: error,
  }
}

export const useUserBands = () => {
  const { data, error } = useSWRImmutable(bandsQuery, query => request('/api/get-user-bands', query));
  return {
    bands: data ? (data as any).bands : [],
    isLoadingBands: !error && !data,
    isErrorLoadingBands: error,
  }
}

export const useUserInvitationBands = () => {
  const { data, error } = useSWRImmutable(userInvitationBandsQuery, query => request('/api/get-user-invitation-bands', query));
  return {
    userInvitationBands: data ? (data as any).userInvitationBands : [],
    isLoadingUserInvitationBands: !error && !data,
    isErrorLoadingUserInvitationBands: error,
  }
}