import React from 'react';
import Header from '@/components/header';
import HeaderPanel from '@/components/header/header-panel';
import Container from '@mui/material/Container';
import FloatingButton from '@/components/floating-button';
import AddIcon from '@mui/icons-material/Add';
import BandDialog from './band-dialog';
import Skeleton from '@mui/material/Skeleton';
import { useBandsState } from '@/lib/bands-store';
import BandDetails from './band-details';
import styles from '@/styles/general.module.css';

const BandForm = () => {
    const { bands, isLoadingBands } = useBandsState();
    const [bandToChange, setBandToChange] = React.useState();
    const [showBandDialog, setShowBandDialog] = React.useState(false);

    let bandsData;
    if (isLoadingBands) {
        bandsData = <Skeleton variant="rect" height={80} className={styles.playlists_skeleton} />;
    } else {
        const onAddBand = () => {
            setBandToChange(null);
            setShowBandDialog(true);
        }

        const onEditBand = ({ band }) => {
            setBandToChange(band);
            setShowBandDialog(true);
        }

        bandsData = (
            <form>
                {bands && bands.map(band => (
                    <BandDetails
                        key={band.id}
                        band={band}
                        onEditBand={() => onEditBand({ band })}
                    />
                ))}
                <div className={styles.fab_buttons}>
                    <FloatingButton
                        id="addBandButton"
                        aria-label="addBand"
                        onClick={() => onAddBand()}
                        title="Add Band"
                        variant={null}
                        icon={<AddIcon />}
                        size="large"
                    />
                </div>
                <BandDialog
                    dialogShown={showBandDialog}
                    onDialogClose={() => setShowBandDialog(false)}
                    band={bandToChange}
                />
            </form>
        );
    }

    return (
        <>
            <HeaderPanel />
            <Header />
            <Container className={styles.content_container}>
                {bandsData}
            </Container>
        </>
    );
}

export default BandForm;