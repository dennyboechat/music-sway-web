import React from 'react';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import MsLogo from '@/components/ms-logo';
import DrawerMenu from '@/components/drawer-menu';
import styles from '@/styles/general.module.css';

const HeaderPanel = ({ children }) => {
    const [showDrawerMenu, setShowDrawerMenu] = React.useState(false);
    const isBiggerResolution = useMediaQuery((theme) => theme.breakpoints.up('sm'));

    const onCloseDrawerMenu = () => {
        setShowDrawerMenu(false);
    }

    return (
        <div className={styles.general_header}>
            <span className={styles.header_logo}>
                <IconButton
                    id="logo_button"
                    onClick={() => setShowDrawerMenu(true)}
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
                id="mainDrawerMenu"
                show={showDrawerMenu}
                onClose={onCloseDrawerMenu}
            />
        </div>
    );
}

export default HeaderPanel;