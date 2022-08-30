import React from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import styles from '@/styles/general.module.css';
import { useMessageState } from '@/lib/message-store';
import { validateBand, validateEmail, focusLastElement } from '@/lib/utils';
import { GraphQLClient } from 'graphql-request';
import { useSWRConfig } from 'swr';
import { createBand, updateBand } from '@/graphQl/mutations';
import { bandsQuery } from '@/graphQl/queries';
import { v4 } from 'uuid';
import { cloneDeep, find, forEach, pick, remove, uniqBy } from 'lodash';
import useMediaQuery from '@mui/material/useMediaQuery';

const getNewInvitationEmail = () => {
    return {
        uuid: v4(),
        invitationEmail: '',
        status: 2,
    };
};

const usePrevious = (value) => {
    const ref = React.useRef();
    React.useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
}

const BandDialog = ({ band, dialogShown, onDialogClose }) => {
    const { setAlertMessage } = useMessageState();
    const [bandName, setBandName] = React.useState();
    const [invitations, setInvitations] = React.useState([getNewInvitationEmail()]);
    const prevInvitations = usePrevious(invitations);
    const [hasBandNameErrors, setHasBandNameErrors] = React.useState(false);
    const [invitationErrors, setInvitationErrors] = React.useState();
    const [saving, setSaving] = React.useState(false);
    const { mutate } = useSWRConfig();
    const isUpdate = band && band.id;
    const isBiggerResolution = useMediaQuery((theme) => theme.breakpoints.up('md'));

    React.useEffect(() => {
        if (dialogShown && band) {
            setBandName(band.name);
            let invitations;
            if (band.members && band.members.length) {
                invitations = band.members.map(member => (
                    {
                        id: member.id,
                        uuid: member.id,
                        invitationEmail: member.invitationEmail,
                        status: member.status,
                    }
                ));
            } else {
                invitations = [];
            }
            invitations.push(getNewInvitationEmail());
            setInvitations(invitations);
        }
    }, [dialogShown, band]);

    React.useEffect(() => {
        if (prevInvitations && invitations && prevInvitations.length < invitations.length) {
            focusLastElement({ rootElemRef: 'div.MuiDialog-container', elementRef: 'input' });
        }
    }, [invitations, prevInvitations]);

    const onChangeInvitationEmail = ({ invitation, invitationEmail }) => {
        const invitationsClone = cloneDeep(invitations);
        let invitationToChange = find(invitationsClone, { uuid: invitation.uuid });
        invitationToChange.invitationEmail = invitationEmail;
        setInvitations(invitationsClone);
    };

    const addInvitationEmail = () => {
        const invitationsClone = cloneDeep(invitations);
        invitationsClone.push(getNewInvitationEmail());
        setInvitations(invitationsClone);
    };

    const removeInvitationEmail = ({ id }) => {
        const invitationsClone = cloneDeep(invitations);
        remove(invitationsClone, { id });
        setInvitations(invitationsClone);
    };

    const onSaveBand = () => async () => {
        const invalidMessages = validateBand({ bandName });
        if (invalidMessages.length) {
            setHasBandNameErrors(true);
            setAlertMessage({ message: `Yoo fill mandatory fields: ${invalidMessages.join(', ')}`, severity: 'error' });
        }

        const invitationEmailErrors = [];
        forEach(invitations, invitation => {
            const errorMessage = validateEmail({ email: invitation.invitationEmail });
            if (errorMessage) {
                invalidMessages.push(errorMessage);
                invitationEmailErrors.push(invitation)
            }
        });
        setInvitationErrors(invitationEmailErrors);

        if (invalidMessages.length) {
            return;
        }

        setSaving(true);

        let members = invitations.filter(obj => { return obj.invitationEmail; });
        members = uniqBy(members, obj => { return obj.invitationEmail });
        members = members.map(obj => pick(obj, ['invitationEmail', 'status']));

        let variables = {
            input: {
                name: bandName,
                members: members,
            }
        }

        if (isUpdate) {
            variables.input.id = band.id;
        }

        try {
            const apiEndpoint = isUpdate ? '/api/edit-band' : '/api/create-band';
            const graphQLClient = new GraphQLClient(apiEndpoint);
            await graphQLClient.request(isUpdate ? updateBand : createBand, variables);
        } catch (error) {
            console.error(error);
        }

        mutate(bandsQuery);
        onClose();
        setAlertMessage({ message: `${bandName} was saved.`, severity: 'success' });
        setSaving(false);
    }

    const onClose = (_, reason) => {
        if (reason === `backdropClick`) {
            return;
        }
        onDialogClose();
        setHasBandNameErrors(false);
        setInvitationErrors(null);
        setBandName('');
        setInvitations([getNewInvitationEmail()]);
    }

    const hasInvitationErrors = ({ invitation }) => {
        return invitationErrors && invitationErrors.length &&
            find(invitationErrors, { uuid: invitation.uuid }) ? true : false;
    }

    return (
        <Dialog
            open={dialogShown}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>
                {isUpdate ? 'Edit Band' : 'Add Band'}
            </DialogTitle>
            <DialogContent className="band_details_dialog_content">
                <Container>
                    <TextField
                        id="bandName"
                        label="Band Name"
                        value={bandName || ''}
                        onChange={e => setBandName(e.target.value)}
                        required
                        fullWidth
                        autoFocus
                        autoComplete="off"
                        inputProps={{ maxLength: 255 }}
                        className="default_bottom_margin"
                        error={hasBandNameErrors}
                        helperText={hasBandNameErrors ? "Whaaat?! No Band Name?!" : null}
                    />
                    <Typography component="h4" color="primary" className={styles.margin_bottom_10px}>
                        {'Invite members to join this awesome band:'}
                    </Typography>
                    {invitations.map((invitation, index) => (
                        <Grid container key={`invitationEmail_${invitation.uuid}`}>
                            <Grid item xs={9}>
                                <TextField
                                    id={`invitationEmail_${invitation.uuid}`}
                                    label="Member Email (Same used in SPOTIFY)"
                                    defaultValue={invitation.invitationEmail || ''}
                                    onBlur={e => onChangeInvitationEmail({ invitation, invitationEmail: e.target.value })}
                                    fullWidth
                                    autoComplete="off"
                                    type="email"
                                    inputProps={{ maxLength: 255 }}
                                    className="default_bottom_margin"
                                    disabled={invitation.id !== undefined}
                                    error={hasInvitationErrors({ invitation })}
                                    helperText={hasInvitationErrors({ invitation }) ? "Invalid Email" : null}
                                />
                            </Grid>
                            {invitation.id &&
                                <Grid item xs={3} className={styles.text_align_right}>
                                    {isBiggerResolution &&
                                        <Button
                                            id={`removeEmail_${index}`}
                                            onClick={() => removeInvitationEmail({ id: invitation.id })}
                                            variant="outlined"
                                            startIcon={<DeleteIcon />}
                                            className={styles.margin_top_10px}
                                            disabled={saving}
                                        >
                                            {'Remove'}
                                        </Button>
                                    }
                                    {!isBiggerResolution &&
                                        <Button
                                            id={`removeEmail_${index}`}
                                            onClick={() => removeInvitationEmail({ id: invitation.id })}
                                            variant="outlined"
                                            className={styles.margin_top_10px}
                                            title={'Remove'}
                                            disabled={saving}
                                        >
                                            <DeleteIcon />
                                        </Button>
                                    }
                                </Grid>
                            }
                            {index + 1 === invitations.length &&
                                <Grid item xs={3} className={styles.text_align_right}>
                                    {isBiggerResolution &&
                                        <Button
                                            id="addEmail"
                                            onClick={addInvitationEmail}
                                            variant="outlined"
                                            startIcon={<AddIcon />}
                                            className={styles.margin_top_10px}
                                            disabled={saving}
                                        >
                                            {'Add other'}
                                        </Button>
                                    }
                                    {!isBiggerResolution &&
                                        <Button
                                            id="addEmail"
                                            onClick={addInvitationEmail}
                                            variant="outlined"
                                            className={styles.margin_top_10px}
                                            title={'Add other'}
                                            disabled={saving}
                                        >
                                            <AddIcon />
                                        </Button>
                                    }
                                </Grid>
                            }
                        </Grid>
                    ))}
                </Container>
            </DialogContent>
            <DialogActions>
                <Button
                    id="cancelBandButton"
                    onClick={onClose}
                    icon={<HighlightOffIcon />}
                    disabled={saving}
                >
                    {'Cancel'}
                </Button>
                <Button
                    id="saveBandButton"
                    onClick={onSaveBand()}
                    icon={<SaveIcon />}
                    disabled={saving}
                >
                    {'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default BandDialog;