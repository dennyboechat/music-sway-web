import React from 'react';

const ConfigurationStateContext = React.createContext('');

export const ConfigurationStateProvider = (props) => {
    const [autoScrollContentSpeed, setAutoScrollContentSpeed] = React.useState(0);
    const value = React.useMemo(() => ({ autoScrollContentSpeed, setAutoScrollContentSpeed }), [autoScrollContentSpeed]);
    return (
        <ConfigurationStateContext.Provider value={value} {...props} />
    );
}

export const useConfigurationState = () => {
    const context = React.useContext(ConfigurationStateContext);
    if(!context) {
        throw new Error("You need to wrap ConfigurationStateProvider.");
    }
    return context;
}