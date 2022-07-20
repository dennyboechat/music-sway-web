import React from 'react';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import TimerIcon from '@mui/icons-material/Timer';
import ConfirmButtonGroup from '@/components/confirm-buttons/confirmButtonGroup';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { useSWRConfig } from 'swr';
import { GraphQLClient } from 'graphql-request';
import { bandsQuery } from '@/graphQl/queries';
import { deleteBand } from '@/graphQl/mutations';
import { useMessageState } from '@/lib/message-store';
import BandUserStatus, { getBandUserStatusById } from '@/lib/band-user-status';
import styles from '@/styles/general.module.css';

const BandDetails = ({ band, onEditBand }) => {
    const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);
    const { setAlertMessage } = useMessageState();
    const { mutate } = useSWRConfig();

    if (!band) {
        return null;
    }

    const onDeleteBand = () => {
        setShowDeleteConfirmation(true);
    };

    const onCancelDeleteBand = () => {
        setShowDeleteConfirmation(false);
    };

    const onConfirmDeleteBand = async () => {
        setDeleting(true);
        try {
            const graphQLClient = new GraphQLClient('/api/delete-band');
            await graphQLClient.request(deleteBand, { id: band.id });
        } catch (error) {
            throw Error(error);
        }
        mutate(bandsQuery);
        setAlertMessage({ message: `${band.name} is gone forever.`, severity: 'success' });
        setDeleting(false);
    }

    const getMemberStatus = ({ member }) => {
        let memberStatus = getBandUserStatusById(member.status);
        switch (memberStatus) {
            case BandUserStatus.APPROVED:
                memberStatus.icon = <ThumbUpAltIcon />;
            case BandUserStatus.PENDING:
                memberStatus.icon = <TimerIcon />;
        }
        return (
            <Tooltip title={memberStatus.label}>
                {memberStatus.icon}
            </Tooltip>
        );
    };

    let editBandButton;
    let deleteBandButton;
    if (showDeleteConfirmation) {
        deleteBandButton = (
            <ConfirmButtonGroup
                onConfirm={onConfirmDeleteBand}
                onCancel={onCancelDeleteBand}
                disabled={deleting}
            />
        );
    } else {
        editBandButton = (
            <Button
                id={`editBandButton_${band.id}`}
                onClick={() => onEditBand()}
                variant="outlined"
                startIcon={<EditIcon />}
                disabled={deleting}
            >
                {'Edit'}
            </Button>
        );
        deleteBandButton = (
            <Button
                id={`deleteBandButton_${band.id}`}
                onClick={() => onDeleteBand()}
                variant="outlined"
                startIcon={<DeleteIcon />}
                disabled={deleting}
            >
                {'Delete'}
            </Button>
        );
    }

    return (
        <Accordion
            id={`${band.id}_accordion`}
            defaultExpanded
            className="ms-accordion"
        >
            <AccordionSummary
                id={`${band.id}_summary`}
                expandIcon={<ExpandMoreIcon />}
            >
                <div className={styles.song_card_title_header}>
                    <Typography component="h4" color="primary">
                        {band.name}
                    </Typography>
                </div>
            </AccordionSummary>
            <AccordionDetails className="band_details">
                <Grid container>
                    {band.members && band.members.map(member => (
                        <Grid item xs={12} key={member.id} className={styles.band_details_row}>
                            <span className={styles.margin_right_10px}>{getMemberStatus({ member })}</span>
                            {member.invitationEmail}
                        </Grid>
                    ))}
                </Grid>
                <div className={styles.text_align_right}>
                    {deleteBandButton}
                    {editBandButton}
                </div>
            </AccordionDetails>
        </Accordion>
    );
};

export default BandDetails;