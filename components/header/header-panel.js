import React from 'react';
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
import { signIn, signOut, getProviders } from 'next-auth/react';
import { useConfigurationState } from '@/lib/configuration-store';
import { useAuthProvider } from '@/lib/auth-provider';

const HeaderPanel = ({ children }) => {
    const { loggedUser } = useAuthProvider();
    const { setShowDrawerMenu } = useConfigurationState();
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [providers, setProviders] = React.useState();
    const isBiggerResolution = useMediaQuery((theme) => theme.breakpoints.up('sm'));

    React.useEffect(() => {
        const getAvailableProviders = async () => {
            const availableProviders = await getProviders();
            setProviders(availableProviders);
        }
        if (!loggedUser) {
            getAvailableProviders();
        }
    }, [loggedUser]);

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

    let userData;
    if (isBiggerResolution) {
        if (loggedUser) {
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
                        <MenuItem disabled>
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
        } else if (providers) {
            userData = Object.values(providers).map((provider, index) => {
                return (
                    <MenuItem key={index} onClick={() => { signIn(provider.id) }}>
                        <ListItemText primary="Log in" />
                    </MenuItem>
                );
            });
        }
    }

    return (
        <div className={styles.general_header}>
            <span className={styles.header_logo}>
                <IconButton
                    id="logo_button"
                    onClick={() => setShowDrawerMenu({ value: loggedUser ? true : false })}
                    disabled={loggedUser ? false : true}
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