import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import styles from '@/styles/general.module.css';

const LoadingPlaylist = () => {
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
            <Grid container columnSpacing={1}>
                <Grid container item xs={12} lg={6} rowSpacing={0.5}>
                    <Grid item xs={12}>
                        <Skeleton variant="rect" height={60} />
                    </Grid>
                    <Grid item xs={12}>
                        <Skeleton variant="rect" height={60} />
                    </Grid>
                    <Grid item xs={12}>
                        <Skeleton variant="rect" height={60} />
                    </Grid>
                    <Grid item xs={12}>
                        <Skeleton variant="rect" height={60} />
                    </Grid>
                    <Grid item xs={12}>
                        <Skeleton variant="rect" height={60} />
                    </Grid>
                    <Grid item xs={12}>
                        <Skeleton variant="rect" height={60} />
                    </Grid>
                </Grid>
                <Grid container item xs={12} lg={6} rowSpacing={0.5}>
                    <Grid item xs={12}>
                        <div style={{ height: '60px' }} />
                    </Grid>
                    <Grid item xs={12}>
                        <Skeleton variant="rect" height={60} />
                    </Grid>
                    <Grid item xs={12}>
                        <Skeleton variant="rect" height={60} />
                    </Grid>
                    <Grid item xs={12}>
                        <Skeleton variant="rect" height={60} />
                    </Grid>
                    <Grid item xs={12}>
                        <Skeleton variant="rect" height={60} />
                    </Grid>
                    <Grid item xs={12}>
                        <Skeleton variant="rect" height={60} />
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
}

export default LoadingPlaylist;