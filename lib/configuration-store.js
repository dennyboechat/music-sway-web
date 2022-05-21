import React from 'react';
import { cloneDeep } from 'lodash';
import PageNavigation from '@/lib/page-navigation';

const ConfigurationStateContext = React.createContext('');

export const ConfigurationStateProvider = (props) => {
    const [configurationData, setConfigurationData] = React.useState({
        autoScrollContentSpeed: 0,
        navigationPage: PageNavigation.SONGS,
    });

    const autoScrollContentSpeed = configurationData?.autoScrollContentSpeed;
    const navigationPage = configurationData?.navigationPage;

    const setAutoScrollContentSpeed = ({ value }) => {
        let configurationDataCopy = cloneDeep(configurationData);
        configurationDataCopy.autoScrollContentSpeed = value;
        setConfigurationData(configurationDataCopy);
    };

    const setNavigationPage = ({ value }) => {
        let configurationDataCopy = cloneDeep(configurationData);
        configurationDataCopy.navigationPage = value;
        setConfigurationData(configurationDataCopy);
    };

    const value = React.useMemo(() => ({
        configurationData,
        setConfigurationData,
        setAutoScrollContentSpeed,
        setNavigationPage,
        autoScrollContentSpeed,
        navigationPage,        
    }), [configurationData]);

    return (
        <ConfigurationStateContext.Provider value={value} {...props} />
    );
}

export const useConfigurationState = () => {
    const context = React.useContext(ConfigurationStateContext);
    if (!context) {
        throw new Error("You need to wrap ConfigurationStateProvider.");
    }
    return context;
}