import React from 'react';
import Router from 'next/router'
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MsLogo from '@/components/ms-logo';
import DrawerMenu from '@/components/drawer-menu';
import UserAvatar from '@/components/user/user-avatar';
import Logout from '@mui/icons-material/Logout';
import styles from '@/styles/general.module.css';
import { signOut } from 'next-auth/react';
import { useConfigurationState } from '@/lib/configuration-store';
import { useAuthProvider } from '@/lib/auth-provider';
import SignInDialog from './signInDialog';

const HeaderPanel = ({ children, showSignInButton = true }) => {
    const { loggedUser } = useAuthProvider();
    const { setShowDrawerMenu } = useConfigurationState();
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [showSignInDialog, setShowSignInDialog] = React.useState(false);
    const isBiggerResolution = useMediaQuery((theme) => theme.breakpoints.up('sm'));

    const onCloseDrawerMenu = () => {
        setShowDrawerMenu({ value: false });
    }

    const handleOpenUserMenu = (event) => {
        if (loggedUser) {
            setAnchorElUser(event.currentTarget);
        }
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const onCloseSignInDialog = () => {
        setShowSignInDialog(false);
    };

    const onClickDrawerMenu = () => {
        if (loggedUser) {
            setShowDrawerMenu({ value: true });
        } else {
            setShowDrawerMenu({ value: false });
            Router.push('/');
        }
    };

    let userData;
    if (loggedUser) {
        if (isBiggerResolution) {
            userData = (
                <>
                    <IconButton
                        id="user_main_menu_button"
                        onClick={handleOpenUserMenu}
                        sx={{ p: 0 }}
                        className="user_main_menu"
                    >
                        <UserAvatar />
                    </IconButton>
                    <Menu
                        id="user_main_menu"
                        sx={{ mt: '45px' }}
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        <MenuItem disabled className={styles.general_header_user_menu_logged_user}>
                            {loggedUser.user?.name}
                        </MenuItem>
                        <MenuItem onClick={() => { signOut() }}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={'Logout'} />
                        </MenuItem>
                    </Menu>
                </>
            );
        }
    } else if (showSignInButton) {
        userData = (
            <MenuItem onClick={() => { setShowSignInDialog(true) }}>
                <ListItemText primary="Sign in" />
            </MenuItem>
        );
    }

    return (
        <div className={styles.general_header}>
            <span className={styles.header_logo}>
                <IconButton
                    id="logo_button"
                    onClick={() => onClickDrawerMenu()}
                >
                    <MsLogo />
                </IconButton >
                {isBiggerResolution &&
                    <span className={styles.general_header_title}>{'Music Sway'}</span>
                }
            </span>
            <div className={styles.header_title} />
            {children}
            {userData}
            <DrawerMenu
                onClose={onCloseDrawerMenu}
            />
            <SignInDialog
                showDialog={showSignInDialog}
                onCloseDialog={onCloseSignInDialog}
            />
        </div>
    );
}

export default HeaderPanel;