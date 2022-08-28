import React from 'react';
import { useUserInvitationBands } from './swr-hooks';

const UserInvitationBandsStateContext = React.createContext({
    userInvitationBands: [],
    isLoadingUserInvitationBands: false,
});

export const UserInvitationBandsStateProvider = (props) => {
    const { userInvitationBands, isLoadingUserInvitationBands } = useUserInvitationBands();
    const value = React.useMemo(() => ({ userInvitationBands, isLoadingUserInvitationBands }), [userInvitationBands, isLoadingUserInvitationBands]);
    return (
        <UserInvitationBandsStateContext.Provider value={value} {...props} />
    );
}

export const useUserInvitationBandsState = () => {
    const context = React.useContext(UserInvitationBandsStateContext);
    if (!context) {
        throw new Error("You need to wrap UserInvitationBandsStateProvider.");
    }
    return context;
}