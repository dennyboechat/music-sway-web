import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import MsLogo from '@/components/ms-logo';
import styles from '@/styles/general.module.css';

const DrawerMenu = ({ id, show, onOpen, onClose }) => {

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
                <div>
                    {'Music Sway'}
                </div>
            </div>
        </SwipeableDrawer>
    );
}

export default DrawerMenu;