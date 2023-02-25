import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import styles from '@/styles/general.module.css';

const LoadingSong = () => {
    const inputSkeletons = new Array(5).fill().map((v, i) =>
        <React.Fragment key={i}>
            <Grid item xs={12} lg={6}>
                <Skeleton variant="rectangular" height={60} />
            </Grid>
            <Grid item xs={12} lg={6}>
                <div />
            </Grid>
        </React.Fragment>
    );
    return (
        <Container className={styles.content_container}>
            <Grid container rowSpacing={0.5}>
                {inputSkeletons}
                <Grid item xs={12} lg={6}>
                    <div />
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Skeleton variant="rectangular" height={400} />
            </Grid>
        </Container>
    );
}

export default LoadingSong;