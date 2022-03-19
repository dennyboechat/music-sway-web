import MsLogo from '@/components/ms-logo';
import styles from '@/styles/general.module.css';

const HeaderPanel = ({ children }) => {
    return (
        <div className={styles.general_header}>
            <span className={styles.header_logo}>
                <MsLogo />
            </span>
            <div className={styles.header_title} />
            {children}
        </div>
    );
}

export default HeaderPanel;