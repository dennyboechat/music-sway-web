import Typography from '@mui/material/Typography';
import Header from '@/components/header';
import HeaderPanel from '@/components/header/header-panel';
import Button from '@mui/material/Button';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import styles from '@/styles/general.module.css';

const HomePage = () => (
    <>
        <Header />
        <div className={styles.home_page_wrapper}>
            <HeaderPanel />
            <div className={styles.home_page_hero}>
                <h1>{'Easy Music Management'}</h1>
                <h4>{'Perfect for all musicians, whether you are a beginner or a pro.'}</h4>
                <ul>
                    <li>{'Create/copy lyrics and playlists with ease.'}</li>
                    <li>{'Hands-free to play instruments without interruption.'}</li>
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
            </div>
            <div className={styles.home_page_footer}>
                <Typography variant="caption" display="block" gutterBottom color="textSecondary">
                    Developed by Denny Boechat
                </Typography>
            </div>
        </div>
    </>
);

export default HomePage;