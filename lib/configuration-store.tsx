import React, { createContext, useState, useMemo, useContext } from 'react';
import { cloneDeep } from 'lodash';
import { PageNavigation } from '@/lib/page-navigation';

interface ConfigurationData {
    autoScrollContentSpeed: number;
    pageNavigation: PageNavigation;
    showDrawerMenu: boolean;
}

interface ConfigurationState {
    setAutoScrollContentSpeed: (value: number) => void;
    setPageNavigation: (value: PageNavigation) => void;
    setShowDrawerMenu: (value: boolean) => void;
    setConfigurationData: React.Dispatch<React.SetStateAction<ConfigurationData>>;
    configurationData: ConfigurationData;
    autoScrollContentSpeed: number;
    pageNavigation: PageNavigation;
    showDrawerMenu: boolean;
}

const ConfigurationStateContext = createContext<ConfigurationState | null>(null);

export const ConfigurationStateProvider: React.FC = (props) => {
    const [configurationData, setConfigurationData] = useState<ConfigurationData>({
        autoScrollContentSpeed: 0,
        pageNavigation: PageNavigation.SONGS,
        showDrawerMenu: false,
    });

    const value = useMemo<ConfigurationState>(() => ({
        setAutoScrollContentSpeed: (value) => {
            setConfigurationData((prevData) => getConfigurationDataSet('autoScrollContentSpeed', value, prevData));
        },
        setPageNavigation: (value) => {
            setConfigurationData((prevData) => getConfigurationDataSet('pageNavigation', value, prevData));
        },
        setShowDrawerMenu: (value) => {
            setConfigurationData((prevData) => getConfigurationDataSet('showDrawerMenu', value, prevData));
        },
        setConfigurationData,
        configurationData,
        autoScrollContentSpeed: configurationData.autoScrollContentSpeed,
        pageNavigation: configurationData.pageNavigation,
        showDrawerMenu: configurationData.showDrawerMenu,
    }), [configurationData, setConfigurationData]);

    return (
        <ConfigurationStateContext.Provider value={value} {...props} />
    );
};

const getConfigurationDataSet = <T extends keyof ConfigurationData>(
    attribute: T,
    value: ConfigurationData[T],
    configurationData: ConfigurationData
) => {
    const configurationDataCopy = cloneDeep(configurationData);
    configurationDataCopy[attribute] = value;
    return configurationDataCopy;
};

export const useConfigurationState = (): ConfigurationState => {
    const context = useContext(ConfigurationStateContext);
    if (!context) {
        throw new Error("You need to wrap ConfigurationStateProvider.");
    }
    return context;
};
