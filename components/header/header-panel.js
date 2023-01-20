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
import Button from '@mui/material/Button';
import Logout from '@mui/icons-material/Logout';
import styles from '@/styles/general.module.css';
import { signIn, signOut } from 'next-auth/react';
import { useConfigurationState } from '@/lib/configuration-store';
import { useAuthProvider } from '@/lib/auth-provider';
import Image from 'next/image';

const HeaderPanel = ({ children, showSignInButton = true }) => {
    const { loggedUser, status } = useAuthProvider();
    const { setShowDrawerMenu } = useConfigurationState();
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [showSignInMenu, setShowSignInMenu] = React.useState(false);
    const [signInProgress, setSignInProgress] = React.useState(false);
    const isBiggerResolution = useMediaQuery((theme) => theme.breakpoints.up('sm'));

    React.useEffect(() => {
        if (status === 'unauthenticated') {
            setSignInProgress(false);
        }
    }, [status]);

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

    const onClickDrawerMenu = () => {
        if (loggedUser) {
            setShowDrawerMenu({ value: true });
        } else {
            setShowDrawerMenu({ value: false });
            Router.push('/');
        }
    };

    const signInWithSpotify = () => {
        setSignInProgress(true);
        signIn('spotify');
    }

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
            <>
                <MenuItem
                    id="signInMenuButton"
                    onClick={() => setShowSignInMenu(!showSignInMenu)}
                    variant="text"
                    disabled={signInProgress}
                >
                    <ListItemText primary="Sign in" />
                </MenuItem>
                <Menu
                    sx={{ mt: '45px' }}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={showSignInMenu}
                    onClose={() => setShowSignInMenu(!showSignInMenu)}
                    className={styles.general_header_user_menu_sing_in}
                >
                    <Button
                        id="signInButton"
                        onClick={signInWithSpotify}
                        variant="outlined"
                        disabled={signInProgress}
                        startIcon={
                            <Image
                                src="/spotify_logo.png"
                                height={20}
                                width={20}
                                alt=""
                            />
                        }
                    >
                        {signInProgress ? ' Sign in ...' : 'Sign in with Spotify'}
                    </Button>
                    <ListItemText
                        secondary="You need SPOTIFY account to log in."
                        className={styles.general_header_user_menu_sing_in_text}
                    />
                </Menu>
            </>
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
        </div>
    );
}

export default HeaderPanel;