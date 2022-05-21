import Header from '@/components/header';
import HeaderPanel from '@/components/header/header-panel';
import Container from '@mui/material/Container';
import styles from '@/styles/general.module.css';

const BandForm = ({ }) => {

    return (
        <>
            <HeaderPanel />
            <form>
                <Header />
                <Container className={styles.content_container}>

                </Container>
            </form>
        </>
    );
}

export default BandForm;