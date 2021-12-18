import React from 'react';

const SongsFilterStateContext = React.createContext('');

export function SongsFilterStateProvider(props) {
    const [songsFilterValue, setSongsFilterValue] = React.useState('');
    const value = React.useMemo(() => ({ songsFilterValue, setSongsFilterValue }), [songsFilterValue]);
    return (
        <SongsFilterStateContext.Provider value={value} {...props} />
    );
}

export function useSongsFilterState() {
    const context = React.useContext(SongsFilterStateContext);
    if (!context) {
        throw new Error("You need to wrap SongsFilterStateProvider.");
    }
    return context;
}