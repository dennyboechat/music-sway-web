import Header from '@/components/header';
import HeaderPanel from '@/components/header/header-panel';
import styles from '@/styles/general.module.css';

const HomePage = () => {

    return (
        <>
            <Header />
            <div className={styles.home_page_wrapper}>
                <HeaderPanel />
            </div>
        </>
    );
}

export default HomePage;