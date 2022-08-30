import React from 'react';
import Button from '@mui/material/Button';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import BandUserStatus from '@/lib/band-user-status';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Grid from '@mui/material/Grid';
import UserInvitationStatus from '@/components/edit-band-form/user-invitation-status';
import { GraphQLClient } from 'graphql-request';
import { userInvitationBandsQuery, playlistsQuery } from '@/graphQl/queries';
import { updateUserInvitationBand } from '@/graphQl/mutations';
import { useSWRConfig } from 'swr';
import { useMessageState } from '@/lib/message-store';
import { useAuthProvider } from '@/lib/auth-provider';
import styles from '@/styles/general.module.css';
import { find } from 'lodash';

const UserInvitationBand = ({ userInvitation }) => {
    const [changingStatus, setChangingStatus] = React.useState(false);
    const [makeStatusChange, setMakeStatusChange] = React.useState(false);
    const { setAlertMessage } = useMessageState();
    const { loggedUser } = useAuthProvider();
    const { mutate } = useSWRConfig();

    if (!userInvitation) {
        return null;
    }

    const onChangeInvitationStatus = async ({ status }) => {
        setChangingStatus(true);
        let variables = {
            input: {
                bandId: userInvitation.id,
                invitationStatus: status.id,
            }
        }
        try {
            const graphQLClient = new GraphQLClient('/api/edit-user-invitation-band');
            await graphQLClient.request(updateUserInvitationBand, variables);
        } catch (error) {
            throw Error(error);
        }
        mutate(userInvitationBandsQuery);
        mutate(playlistsQuery);
        setAlertMessage({ message: `${userInvitation.name} status changed.`, severity: 'success' });
        setMakeStatusChange(false);
        setChangingStatus(false);
    };

    const statusActionButtons = (
        <>
            <Button
                id={`confirmBandInvitationButton_${userInvitation.id}`}
                onClick={() => onChangeInvitationStatus({ status: BandUserStatus.APPROVED })}
                variant="outlined"
                startIcon={<ThumbUpOffAltIcon />}
                disabled={changingStatus}
            >
                {'Confirm'}
            </Button>
            <Button
                id={`denyBandInvitationButton_${userInvitation.id}`}
                onClick={() => onChangeInvitationStatus({ status: BandUserStatus.DENIED })}
                variant="outlined"
                startIcon={<ThumbDownOffAltIcon />}
                disabled={changingStatus}
            >
                {'Deny'}
            </Button>
        </>
    );

    const currentUser = find(userInvitation.members, { invitationEmail: loggedUser.user.email });
    const isConfirmedStatus = Number(currentUser.status) === BandUserStatus.APPROVED.id;
    const isPendingStatus = Number(currentUser.status) === BandUserStatus.PENDING.id;
    const bandNameAndOwner = (
        <>
            <span className={styles.band_details_invitation_name}>
                {userInvitation.name}
            </span>
            <span>
                {`by ${userInvitation.ownerName}`}
            </span>
        </>
    );

    let bandPanel;
    if (isPendingStatus) {
        bandPanel = (
            <div>
                <div>
                    {bandNameAndOwner}
                    <span>{` invited you to join them`}</span>
                </div>
                {statusActionButtons}
            </div>
        );
    } else {
        bandPanel = (
            <Accordion
                id={`${userInvitation.id}_accordion`}
                defaultExpanded
                className="ms-accordion"
            >
                <AccordionSummary
                    id={`${userInvitation.id}_summary`}
                    expandIcon={<ExpandMoreIcon />}
                >
                    <div>
                        {bandNameAndOwner}
                    </div>
                </AccordionSummary>
                <AccordionDetails className="band_details">
                    <Grid container>
                        {userInvitation.members && userInvitation.members.map(member => (
                            <Grid item xs={12} key={member.id} className={styles.band_details_row}>
                                <span className={styles.margin_right_10px}>
                                    <UserInvitationStatus member={member} />
                                </span>
                                {member.invitationEmail}
                            </Grid>
                        ))}
                    </Grid>
                    <div className={styles.text_align_right}>
                        {!makeStatusChange &&
                            <Button
                                id={`changeStatusButton_${userInvitation.id}`}
                                onClick={() => setMakeStatusChange(!makeStatusChange)}
                                variant="outlined"
                                startIcon={isConfirmedStatus ? <ThumbUpOffAltIcon /> : <ThumbDownOffAltIcon />}
                                disabled={changingStatus}
                            >
                                {'Change Status'}
                            </Button>
                        }
                        {makeStatusChange &&
                            <>
                                {statusActionButtons}
                                <Button
                                    id={`cancelBandInvitationButton_${userInvitation.id}`}
                                    onClick={() => setMakeStatusChange(false)}
                                    variant="outlined"
                                    color="secondary"
                                    startIcon={<HighlightOffIcon />}
                                    disabled={changingStatus}
                                >
                                    {'No Change'}
                                </Button>
                            </>
                        }
                    </div>
                </AccordionDetails>
            </Accordion>
        )
    };

    return (
        bandPanel
    );

};

export default UserInvitationBand;