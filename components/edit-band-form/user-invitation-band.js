import React from 'react';
import Button from '@mui/material/Button';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import BandUserStatus from '@/lib/band-user-status';
import { GraphQLClient } from 'graphql-request';
import { userInvitationBandsQuery } from '@/graphQl/queries';
import { updateUserInvitationBand } from '@/graphQl/mutations';
import { useSWRConfig } from 'swr';
import { useMessageState } from '@/lib/message-store';

const UserInvitationBand = ({ userInvitation }) => {
    const [changingStatus, setChangingStatus] = React.useState(false);
    const { setAlertMessage } = useMessageState();
    const { mutate } = useSWRConfig();

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
        setAlertMessage({ message: `${userInvitation.name} status changed.`, severity: 'success' });
        setChangingStatus(false);
    };

    return (
        <>
            {userInvitation.name}
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

};

export default UserInvitationBand;