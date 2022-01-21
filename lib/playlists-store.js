import React from 'react';
import { usePlaylists } from './swr-hooks'

const PlaylistsStateContext = React.createContext({
    playlists: [],
    isLoadingPlaylists: false,
});

export const PlaylistsStateProvider = (props) => {
    const { playlists, isLoadingPlaylists } = usePlaylists();
    const value = React.useMemo(() => ({ playlists, isLoadingPlaylists }), [playlists, isLoadingPlaylists]);
    return (
        <PlaylistsStateContext.Provider value={value} {...props} />
    );
}

export const usePlaylistsState = () => {
    const context = React.useContext(PlaylistsStateContext);
    if (!context) {
        throw new Error("You need to wrap PlaylistsStateProvider.");
    }
    return context;
}