import React from 'react';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import MsLogo from '@/components/ms-logo';
import DrawerMenu from '@/components/drawer-menu';
import styles from '@/styles/general.module.css';
import { useConfigurationState } from '@/lib/configuration-store';

const HeaderPanel = ({ children }) => {
    const { setShowDrawerMenu } = useConfigurationState();
    const isBiggerResolution = useMediaQuery((theme) => theme.breakpoints.up('sm'));

    const onCloseDrawerMenu = () => {
        setShowDrawerMenu({ value: false });
    }

    return (
        <div className={styles.general_header}>
            <span className={styles.header_logo}>
                <IconButton
                    id="logo_button"
                    onClick={() => setShowDrawerMenu({ value: true })}
                >
                    <MsLogo />
                </IconButton >
                {isBiggerResolution &&
                    <span className={styles.general_header_title}>{'Music Sway'}</span>
                }
            </span>
            <div className={styles.header_title} />
            {children}
            <DrawerMenu
                onClose={onCloseDrawerMenu}
            />
        </div>
    );
}

export default HeaderPanel;