import React from 'react';
import { useBandsSongs } from './swr-hooks';

const BandsSongsStateContext = React.createContext({
    bandsSongs: [],
    isLoadingBandsSongs: false,
});

export const BandsSongsStateProvider = (props) => {
    const { bandsSongs, isLoadingBandsSongs } = useBandsSongs();
    const value = React.useMemo(() => ({ bandsSongs, isLoadingBandsSongs }), [bandsSongs, isLoadingBandsSongs]);
    return (
        <BandsSongsStateContext.Provider value={value} {...props} />
    );
}

export const useBandsSongsState = () => {
    const context = React.useContext(BandsSongsStateContext);
    if (!context) {
        throw new Error("You need to wrap BandsSongsStateProvider.");
    }
    return context;
}