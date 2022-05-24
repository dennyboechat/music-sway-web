import React from 'react';
import { cloneDeep } from 'lodash';
import PageNavigation from '@/lib/page-navigation';

const ConfigurationStateContext = React.createContext('');

export const ConfigurationStateProvider = (props) => {
    const [configurationData, setConfigurationData] = React.useState({
        autoScrollContentSpeed: 0,
        pageNavigation: PageNavigation.SONGS,
        showDrawerMenu: false,
    });

    const value = React.useMemo(() => ({
        setAutoScrollContentSpeed: ({ value }) => {
            setConfigurationData(getConfigurationDataSet({ attribute: 'autoScrollContentSpeed', value, configurationData }));
        },
        setPageNavigation: ({ value }) => {
            setConfigurationData(getConfigurationDataSet({ attribute: 'pageNavigation', value, configurationData }));
        },
        setShowDrawerMenu: ({ value }) => {
            setConfigurationData(getConfigurationDataSet({ attribute: 'showDrawerMenu', value, configurationData }));
        },
        setConfigurationData,
        configurationData,
        autoScrollContentSpeed: configurationData?.autoScrollContentSpeed,
        pageNavigation: configurationData?.pageNavigation,
        showDrawerMenu: configurationData?.showDrawerMenu,
    }), [configurationData, setConfigurationData]);

    return (
        <ConfigurationStateContext.Provider value={value} {...props} />
    );
}

const getConfigurationDataSet = ({ attribute, value, configurationData }) => {
    let configurationDataCopy = cloneDeep(configurationData);
    configurationDataCopy[attribute] = value;
    return configurationDataCopy;
}

export const useConfigurationState = () => {
    const context = React.useContext(ConfigurationStateContext);
    if (!context) {
        throw new Error("You need to wrap ConfigurationStateProvider.");
    }
    return context;
}