import React from 'react';

const PlaylistsFilterStateContext = React.createContext(true);

export const PlaylistsFilterStateProvider = (props: any) => {
    const [playlistsFilterValue, setPlaylistsFilterValue] = React.useState(true);
    const value = React.useMemo(() => ({ playlistsFilterValue, setPlaylistsFilterValue }), [playlistsFilterValue]);
    return (
        <PlaylistsFilterStateContext.Provider value={value} {...props} />
    );
}

export const usePlaylistsFilterState = () => {
    const context = React.useContext(PlaylistsFilterStateContext);
    if (!context) {
        throw new Error("You need to wrap PlaylistsFilterStateProvider.");
    }
    return context;
}