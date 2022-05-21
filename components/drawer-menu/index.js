import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import MsLogo from '@/components/ms-logo';
import Router from 'next/router'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import LocalPlayIcon from '@mui/icons-material/LocalPlay';
import { useConfigurationState } from '@/lib/configuration-store';
import PageNavigation from '@/lib/page-navigation';
import styles from '@/styles/general.module.css';

const DrawerMenu = ({ id, show, onOpen = () => { }, onClose }) => {

    const { setNavigationPage } = useConfigurationState();

    const goToMainPage = ({ pageNavigation }) => {
        setNavigationPage({ value: pageNavigation });
        Router.push('/');
    };

    return (
        <SwipeableDrawer
            id={id}
            anchor="left"
            open={show}
            onOpen={onOpen}
            onClose={onClose}
        >
            <div>
                <div className={styles.drawer_menu_logo}>
                    <MsLogo />
                </div>
                <div className={styles.drawer_menu_title}>
                    {'Music Sway'}
                </div>
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
                                <LibraryMusicIcon />
                            </ListItemIcon>
                            <ListItemText primary={'Playlists'} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={'band'} disablePadding>
                        <ListItemButton onClick={() => { Router.push('/band') }}>
                            <ListItemIcon>
                                <LocalPlayIcon />
                            </ListItemIcon>
                            <ListItemText primary={'Band'} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </div>
        </SwipeableDrawer >
    );
}

export default DrawerMenu;