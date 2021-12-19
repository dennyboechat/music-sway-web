import React from 'react';
import { useSongs } from './swr-hooks'

const SongsStateContext = React.createContext({
    songs: [],
    isLoadingSongs: false,
});

export const SongsStateProvider = (props) => {
    const { songs, isLoadingSongs } = useSongs();
    const value = React.useMemo(() => ({ songs, isLoadingSongs }), [songs, isLoadingSongs]);
    return (
        <SongsStateContext.Provider value={value} {...props} />
    );
}

export const useSongsState = () => {
    const context = React.useContext(SongsStateContext);
    if (!context) {
        throw new Error("You need to wrap SongsStateProvider.");
    }
    return context;
}