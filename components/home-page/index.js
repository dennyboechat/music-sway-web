import Header from '@/components/header';
import HeaderPanel from '@/components/header/header-panel';
import Grid from '@mui/material/Grid';
import styles from '@/styles/general.module.css';

const HomePage = () => {

    return (
        <>
            <Header />
            <div className={styles.home_page_wrapper}>
                <HeaderPanel />
                <Grid container>
                    <Grid item xs={12} lg={6}><br /></Grid>
                    <Grid item xs={12} lg={6} className={styles.home_page_main_text}>
                        {'Manage music you play'}
                    </Grid>
                </Grid>
            </div>
        </>
    );
}

export default HomePage;