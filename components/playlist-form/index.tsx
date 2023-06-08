import React from 'react';
import Router from 'next/router';
import Header from '@/components/header';
import PlaylistSongEntry from '@/components/playlist-form/song-entry';
import ConfirmButtonFab from '@/components/confirm-buttons/confirmButtonFab';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import FloatingButton from '@/components/floating-button';
import SaveIcon from '@mui/icons-material/Save';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMediaQuery, Theme } from '@mui/material';
import { useMessageState } from '@/lib/message-store';
import RestrictionSelection from '@/components/restriction-selection';
import styles from '@/styles/general.module.css';
import { pick } from 'lodash';
import { validatePlaylist } from '@/lib/utils';
import Restriction, { getRestrictionByName } from '@/lib/restriction';
import { createPlaylist, updatePlaylist, deletePlaylist } from '@/graphQl/mutations';
import { GraphQLClient } from 'graphql-request';
import { useSWRConfig } from 'swr';
import { playlistsQuery } from '@/graphQl/queries';
import { useConfigurationState } from '@/lib/configuration-store';
import { PageNavigation } from '@/lib/page-navigation';
import type { Playlist, PlaylistEntry } from '@/components/types/PlaylistProps';

const PlaylistForm = ({ playlist, apiEndpoint }: { playlist: Playlist, apiEndpoint: string }) => {
    const [playlistName, setPlaylistName] = React.useState(playlist?.name);
    const [playlistObservation, setPlaylistObservation] = React.useState(playlist?.observation);
    const [playlistRestrictionId, setPlaylistRestrictionId] = React.useState(playlist?.restrictionId);
    const [playlistEntries, setPlaylistEntries] = React.useState<PlaylistEntry[]>(playlist.entries || []);
    const [saving, setSaving] = React.useState(false);
    const [savingAndAddingNew, setSavingAndAddingNew] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);
    const [canceling, setCanceling] = React.useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false);
    const [hasErrors, setHasErrors] = React.useState(false);
    const { setAlertMessage } = useMessageState();
    const { setPageNavigation } = useConfigurationState();
    const isLgResolution = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
    const { mutate } = useSWRConfig();

    if (!playlist) {
        return null;
    }

    const backToMainPage = () => {
        setPageNavigation(PageNavigation.PLAYLISTS);
        Router.push('/');
    }

    const onSave = ({ addsNew }: { addsNew: boolean }) => async () => {
        const invalidMessages = validatePlaylist({ playlistName, playlistRestrictionId });
        if (invalidMessages.length) {
            setAlertMessage({ message: `Yoo fill mandatory fields: ${invalidMessages.join(', ')}`, severity: 'error' });
            setHasErrors(true);
            return;
        }

        if (addsNew) {
            setSavingAndAddingNew(true);
        } else {
            setSaving(true);
        }

        const entries = playlistEntries.map(obj => pick(obj, ['songId', 'orderIndex']));

        let variables = {
            input: {
                id: playlist.id,
                name: playlistName,
                observation: playlistObservation,
                restrictionId: playlistRestrictionId,
                entries: entries,
            }
        }

        try {
            const graphQLClient = new GraphQLClient(apiEndpoint);
            await graphQLClient.request(playlist.id ? updatePlaylist : createPlaylist, variables);
        } catch (error) {
            console.error(error);
        }

        mutate(playlistsQuery);
        setAlertMessage({ message: `${playlistName} was saved.`, severity: 'success' });

        if (addsNew) {
            Router.push('/playlist/new');

            setPlaylistName('');
            setPlaylistObservation('');
            setPlaylistRestrictionId(Restriction.BAND.id);
            setPlaylistEntries([]);

            setSavingAndAddingNew(false);
        } else {
            backToMainPage();
            setSaving(false);
        }
    };

    const onDelete = () => {
        setShowDeleteConfirmation(true);
    };

    const onCancelDelete = () => {
        setShowDeleteConfirmation(false);
    };

    const onConfirmDelete = async () => {
        setDeleting(true);
        try {
            const graphQLClient = new GraphQLClient('/api/delete-playlist');
            await graphQLClient.request(deletePlaylist, { id: playlist.id });
        } catch (error: any) {
            throw Error(error);
        }
        mutate(playlistsQuery);
        backToMainPage();
        setAlertMessage({ message: `${playlistName} is gone forever.`, severity: 'success' });
        setDeleting(false);
    };

    const onCancel = async () => {
        backToMainPage();
        setCanceling(true);
    }

    const handleSetPlaylistRestrictionId = (name: string) => {
        const restriction = getRestrictionByName(name);
        setPlaylistRestrictionId(restriction?.id);
    }

    const disabled = saving || savingAndAddingNew || deleting || canceling;

    let saveAndAddNewButton;
    if (!showDeleteConfirmation) {
        let buttonLabel;
        if (savingAndAddingNew) {
            buttonLabel = 'Saving';
        } else {
            buttonLabel = (
                <div className={styles.button_label_wrapper}>
                    {'Save'}
                    <div className={styles.button_caption_text}>
                        {'& Add New'}
                    </div>
                </div>
            );
        }
        saveAndAddNewButton =
            <FloatingButton
                id="saveAndAddNewPlaylistButton"
                ariaLabel="saveAndAddNew"
                disabled={disabled}
                label={buttonLabel}
                icon={<SaveAsIcon />}
                onClick={onSave({ addsNew: true })}
                size={undefined}
                title={undefined}
                href={undefined}
            />;
    }

    let deleteButton;
    if (playlist.id) {
        if (showDeleteConfirmation) {
            deleteButton = (
                <ConfirmButtonFab
                    onConfirm={onConfirmDelete}
                    onCancel={onCancelDelete}
                    disabled={disabled}
                />
            );
        } else {
            deleteButton = (
                <FloatingButton
                    id="deletePlaylistButton"
                    ariaLabel="deletePlaylist"
                    color="secondary"
                    disabled={disabled}
                    label='Delete'
                    icon={<DeleteIcon />}
                    onClick={onDelete}
                    size={undefined}
                    title={undefined}
                    href={undefined}
                />
            );
        }
    }

    const playlistNameHeader = playlistName ? `- ${playlistName}` : '';
    const columnDirection = isLgResolution ? 'row' : 'column-reverse';

    return (
        <form>
            <Header titleSuffix={playlistNameHeader} />
            <Container className={styles.content_container}>
                <Grid container direction={columnDirection}>
                    <Grid item xs={12} lg={6}>
                        <TextField
                            id="playlistName"
                            label="Playlist Name"
                            value={playlistName || ''}
                            onChange={e => setPlaylistName(e.target.value)}
                            required
                            fullWidth
                            autoFocus
                            autoComplete="off"
                            className="default_bottom_margin"
                            inputProps={{ maxLength: 255 }}
                            error={hasErrors}
                            helperText={hasErrors ? "Hey add a Playlist Name mate!" : null}
                        />
                    </Grid>
                    <Grid item xs={12} lg={6} className={styles.text_align_right}>
                        <RestrictionSelection
                            id="playlist_restriction"
                            selectedRestrictionId={playlistRestrictionId}
                            onChange={handleSetPlaylistRestrictionId}
                            options={[Restriction.BAND, Restriction.PRIVATE]}
                        />
                    </Grid>
                </Grid>
                <Grid container item xs={12} lg={6}>
                    <TextField
                        id="playlistObservation"
                        label="Observation"
                        value={playlistObservation || ''}
                        onChange={e => setPlaylistObservation(e.target.value)}
                        fullWidth
                        multiline
                        autoComplete="off"
                        className="default_bottom_margin"
                        inputProps={{ maxLength: 2550 }}
                    />
                </Grid>
                <PlaylistSongEntry
                    playlistEntries={playlistEntries}
                    setPlaylistEntries={setPlaylistEntries}
                    disabledButtons={disabled}
                />
                <div className={styles.fab_buttons}>
                    {deleteButton}
                    {!showDeleteConfirmation &&
                        <FloatingButton
                            id="savePlaylistButton"
                            ariaLabel="save"
                            disabled={disabled}
                            label={saving ? 'Saving' : 'Save'}
                            icon={<SaveIcon />}
                            onClick={onSave({ addsNew: false })}
                            size={undefined}
                            title={undefined}
                            href={undefined}
                        />
                    }
                    {saveAndAddNewButton}
                    {!showDeleteConfirmation &&
                        <FloatingButton
                            id="cancelPlaylistButton"
                            color="secondary"
                            ariaLabel="cancel"
                            disabled={disabled}
                            label='Cancel'
                            icon={<HighlightOffIcon />}
                            onClick={onCancel}
                            size={undefined}
                            title={undefined}
                            href={undefined}
                        />
                    }
                </div>
            </Container>
        </form>
    );
}

export default PlaylistForm;