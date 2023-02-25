import React from 'react';
import Header from '@/components/header';
import HeaderPanel from '@/components/header/header-panel';
import Container from '@mui/material/Container';
import FloatingButton from '@/components/floating-button';
import AddIcon from '@mui/icons-material/Add';
import BandDialog from './band-dialog';
import Skeleton from '@mui/material/Skeleton';
import { useBandsState } from '@/lib/bands-store';
import { useUserInvitationBandsState } from '@/lib/user-invitation-bands-store';
import BandDetails from './band-details';
import UserInvitationBand from './user-invitation-band';
import styles from '@/styles/general.module.css';
import { useAuthProvider } from '@/lib/auth-provider';
import BandUserStatus from '@/lib/band-user-status';
import { forEach, find } from 'lodash';

const BandForm = () => {
    const { bands, isLoadingBands } = useBandsState();
    const { userInvitationBands } = useUserInvitationBandsState();
    const [bandToChange, setBandToChange] = React.useState();
    const [showBandDialog, setShowBandDialog] = React.useState(false);
    const { loggedUser } = useAuthProvider();

    let bandsData;
    let invitationBandsData;

    if (userInvitationBands) {
        const pendingInvitations = [];
        const otherInvitations = [];
        forEach(userInvitationBands, userInvitation => {
            const currentUser = find(userInvitation.members, { invitationEmail: loggedUser.user.email });
            const invitationComponent = (
                <>
                    <UserInvitationBand
                        key={userInvitation.id}
                        userInvitation={userInvitation}
                    />
                    <br />
                </>
            );
            if (Number(currentUser.status) === BandUserStatus.PENDING.id) {
                pendingInvitations.push(invitationComponent);
            } else {
                otherInvitations.push(invitationComponent);
            }
        });
        invitationBandsData = (
            <>
                {pendingInvitations}
                {otherInvitations}
            </>
        );
    }

    if (isLoadingBands) {
        bandsData = <Skeleton variant="rectangular" height={80} className={styles.playlists_skeleton} />;
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
                    <React.Fragment key={band.id}>
                        <BandDetails
                            band={band}
                            onEditBand={() => onEditBand({ band })}
                        />
                        <br />
                    </React.Fragment>
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
                {invitationBandsData}
                {bandsData}
            </Container>
        </>
    );
}

export default BandForm;