import React from 'react';
import { useUserBands } from './swr-hooks';

const BandsStateContext = React.createContext({
    bands: [],
    isLoadingBands: false,
});

export const BandsStateProvider: React.FC = (props) => {
    const { bands, isLoadingBands } = useUserBands();
    const value = React.useMemo(() => ({ bands, isLoadingBands }), [bands, isLoadingBands]);
    return (
        <BandsStateContext.Provider value={value} {...props} />
    );
}

export const useBandsState = () => {
    const context = React.useContext(BandsStateContext);
    if (!context) {
        throw new Error("You need to wrap BandsStateProvider.");
    }
    return context;
}