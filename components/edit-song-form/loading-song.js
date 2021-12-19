import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import styles from '@/styles/general.module.css';

const LoadingSong = () => {
    const songPanelHeight = 110;
    return (
        <Container className={styles.content_container}>
            <Skeleton variant="rect" height={songPanelHeight} className={styles.songs_list_skeleton} />
            <Skeleton variant="rect" height={songPanelHeight} className={styles.songs_list_skeleton} />
        </Container>
    );
}

export default LoadingSong;