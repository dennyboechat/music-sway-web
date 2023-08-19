import React from 'react';
import { useSongs } from './swr-hooks';
import { Song } from '@/components/types/SongProps';

interface SongsState {
    songs: Song[];
    isLoadingSongs: boolean;
}

const SongsStateContext = React.createContext<SongsState>({
    songs: [],
    isLoadingSongs: false,
});

export const SongsStateProvider: React.FC = (props) => {
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