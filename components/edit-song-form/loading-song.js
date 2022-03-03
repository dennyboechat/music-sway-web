import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import styles from '@/styles/general.module.css';

const LoadingSong = () => {
    return (
        <Container className={styles.content_container}>
            <Skeleton variant="rect" height={110} className={styles.songs_list_skeleton} />
        </Container>
    );
}

export default LoadingSong;