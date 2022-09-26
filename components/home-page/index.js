import Header from '@/components/header';
import HeaderPanel from '@/components/header/header-panel';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import styles from '@/styles/general.module.css';

const HomePage = () => {

    return (
        <>
            <Header />
            <div className={styles.home_page_wrapper}>
                <HeaderPanel />
                <div className={styles.home_page_hero}>
                    <h1>{'Manage Music You Play'}</h1>
                    <h4>{'Made for beginner players, singers, garage bands and professionals.'}</h4>
                    <ul>
                        <li>{'Create/copy lyrics and playlists.'}</li>
                        <li>{'Hands free to play your instrument.'}</li>
                        <li>{'Screen never locks.'}</li>
                        <li>{'Keep songs/playlists private or shared.'}</li>
                        <li>{'Great in mobiles, tablets and laptops.'}</li>
                    </ul>
                    <Button
                        id={'startNowButton'}
                        onClick={() => { signIn('spotify') }}
                        variant="outlined"
                        startIcon={
                            <Image
                                src="/spotify_logo.png"
                                height={20}
                                width={20}
                                alt=""
                            />
                        }
                    >
                        {'Start Now'}
                    </Button>
                    <br />
                    <br />
                    <br />
                    {/* <Grid container rowSpacing={50}>
                        <Grid item xs={6} md={3}>
                            <Image
                                src="/songs.jpg"
                                width={1295}
                                height={781}
                                alt=""
                            />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Image
                                src="/song.jpg"
                                width={1295}
                                height={781}
                                alt=""
                            />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Image
                                src="/create_playlist.jpg"
                                width={1295}
                                height={781}
                                alt=""
                            />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Image
                                src="/playlists.jpg"
                                width={1295}
                                height={781}
                                alt=""
                            />
                        </Grid>
                    </Grid> */}
                </div>
            </div>
        </>
    );
}

export default HomePage;