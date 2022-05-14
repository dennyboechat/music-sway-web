import React from 'react';

const MessageStateContext = React.createContext('');

export const MessageStateProvider = (props) => {
    const [alertMessage, setAlertMessage] = React.useState();
    const value = React.useMemo(() => ({ alertMessage, setAlertMessage }), [alertMessage]);
    return (
        <MessageStateContext.Provider value={value} {...props} />
    );
}

export const useMessageState = () => {
    const context = React.useContext(MessageStateContext);
    if (!context) {
        throw new Error("You need to wrap MessageStateProvider.");
    }
    return context;
}