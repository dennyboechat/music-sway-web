import useMediaQuery from '@mui/material/useMediaQuery';
import MsLogo from '@/components/ms-logo';
import styles from '@/styles/general.module.css';

const HeaderPanel = ({ children }) => {

    const isSmResolution = useMediaQuery((theme) => theme.breakpoints.up('sm'));

    return (
        <div className={styles.general_header}>
            <span className={styles.header_logo}>
                <MsLogo />
                {isSmResolution &&
                    <span className={styles.general_header_title}>{'Music Sway'}</span>
                }
            </span>
            <div className={styles.header_title} />
            {children}
        </div>
    );
}

export default HeaderPanel;