import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import styles from '@/styles/general.module.css';

const LoadingPlaylist = () => {
    const songsSkeletons = new Array(6).fill().map((v, i) =>
        <>
            <Grid key={i} item xs={12} lg={6}>
                <Skeleton variant="rect" height={60} />
            </Grid>
            <Grid key={`${i}_`} item xs={12} lg={6}>
                <div />
            </Grid>
        </>
    );
    return (
        <Container className={styles.content_container}>
            <Grid container rowSpacing={1}>
                <Grid item xs={12} lg={6}>
                    <Skeleton variant="rect" height={60} />
                </Grid>
                <Grid item xs={12} lg={6}>
                    <div />
                </Grid>
                <Grid item xs={12} lg={6}>
                    <Skeleton variant="rect" height={60} />
                </Grid>
                <Grid item xs={12} lg={6}>
                    <div />
                </Grid>
                <Grid item xs={12} lg={6}>
                    <div />
                </Grid>
            </Grid>
            <Grid container rowSpacing={0.5}>
                {songsSkeletons}
            </Grid>
        </Container>
    );
}

export default LoadingPlaylist;