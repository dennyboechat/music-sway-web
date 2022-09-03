import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import MsLogo from '@/components/ms-logo';
import UserAvatar from '@/components/user/user-avatar';
import Router from 'next/router'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import Logout from '@mui/icons-material/Logout';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import LocalPlayIcon from '@mui/icons-material/LocalPlay';
import { useConfigurationState } from '@/lib/configuration-store';
import PageNavigation from '@/lib/page-navigation';
import { signOut } from 'next-auth/react';
import { useAuthProvider } from '@/lib/auth-provider';
import styles from '@/styles/general.module.css';
import { cloneDeep } from 'lodash';

const DrawerMenu = ({ id = 'mainDrawerMenu', onOpen = () => { }, onClose }) => {
    const { loggedUser } = useAuthProvider();
    const { showDrawerMenu, setShowDrawerMenu, configurationData, setConfigurationData } = useConfigurationState();

    const goToMainPage = ({ pageNavigation }) => {
        let configurationDataCopy = cloneDeep(configurationData);
        configurationDataCopy.pageNavigation = pageNavigation;
        configurationDataCopy.showDrawerMenu = false;
        setConfigurationData(configurationDataCopy);
        Router.push('/');
    };

    const goTo = ({ path }) => {
        setShowDrawerMenu({ value: false });
        Router.push(path);
    };

    return (
        <SwipeableDrawer
            id={id}
            anchor="left"
            open={showDrawerMenu}
            onOpen={onOpen}
            onClose={onClose}
        >
            <div className={styles.drawer_menu}>
                <div className={styles.drawer_menu_logo}>
                    <MsLogo />
                </div>
                <div className={styles.drawer_menu_title}>
                    {'Music Sway'}
                </div>
                <br />
                <List>
                    <ListItem key={'songs'} disablePadding>
                        <ListItemButton onClick={() => { goToMainPage({ pageNavigation: PageNavigation.SONGS }) }}>
                            <ListItemIcon>
                                <MusicNoteIcon />
                            </ListItemIcon>
                            <ListItemText primary={'Songs'} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={'playlists'} disablePadding>
                        <ListItemButton onClick={() => goToMainPage({ pageNavigation: PageNavigation.PLAYLISTS })}>
                            <ListItemIcon>
                                <QueueMusicIcon />
                            </ListItemIcon>
                            <ListItemText primary={'Playlists'} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={'bandsSongs'} disablePadding>
                        <ListItemButton onClick={() => { goTo({ path: '/bands-songs' }) }}>
                            <ListItemIcon>
                                <LibraryMusicIcon />
                            </ListItemIcon>
                            <ListItemText primary={'Bands Songs'} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={'bands'} disablePadding>
                        <ListItemButton onClick={() => { goTo({ path: '/bands' }) }}>
                            <ListItemIcon>
                                <LocalPlayIcon />
                            </ListItemIcon>
                            <ListItemText primary={'Bands'} />
                        </ListItemButton>
                    </ListItem>
                    <Divider />
                    <ListItem key={'logout'} disablePadding>
                        <ListItemButton onClick={() => { signOut() }}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={'Logout'} />
                        </ListItemButton>
                    </ListItem>
                </List>
                <div className={styles.drawer_menu_user}>
                    <UserAvatar />
                    {loggedUser?.user?.name}
                </div>
            </div>
        </SwipeableDrawer>
    );
}

export default DrawerMenu;