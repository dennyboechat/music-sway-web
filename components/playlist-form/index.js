import React from 'react';
import Router from 'next/router'
import Header from '@/components/header';
import PlaylistSongEntry from '@/components/playlist-form/song-entry';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Fab from '@mui/material/Fab';
import RestrictionSelection from '@/components/restriction-selection';
import styles from '@/styles/general.module.css';
import { pick } from 'lodash';
import { validatePlaylist } from '@/lib/utils';
import { getRestrictionByName } from '@/lib/restriction';
import { createPlaylist, updatePlaylist, deletePlaylist } from '@/graphQl/mutations';
import { GraphQLClient } from 'graphql-request';

const PlaylistForm = ({ playlist, apiEndpoint }) => {
    const [playlistName, setPlaylistName] = React.useState(playlist?.name);
    const [playlistObservation, setPlaylistObservation] = React.useState(playlist?.observation);
    const [playlistRestrictionId, setPlaylistRestrictionId] = React.useState(playlist?.restrictionId);
    let [playlistEntries, setPlaylistEntries] = React.useState(playlist.entries || []);
    const [submitting, setSubmitting] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);

    if (!playlist) {
        return null;
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const invalidMessages = validatePlaylist({ playlistName, playlistRestrictionId });
        if (invalidMessages.length) {
            console.error('Missing mandatory fields: ' + invalidMessages.join(', '));
            return;
        }
        setSubmitting(true);

        const entries = playlistEntries.map(obj => pick(obj, ['songId', 'orderIndex']));

        let variables = {
            input: {
                name: playlistName,
                observation: playlistObservation,
                restrictionId: playlistRestrictionId,
                entries: entries,
            }
        }

        if (playlist.id) {
            variables.input.id = playlist.id;
        }

        try {
            const graphQLClient = new GraphQLClient(apiEndpoint);
            await graphQLClient.request(playlist.id ? updatePlaylist : createPlaylist, variables);
        } catch (error) {
            console.error(error);
        }

        Router.push('/');
        setSubmitting(false);
    };

    const removePlaylist = async () => {
        setDeleting(true);
        try {
            const graphQLClient = new GraphQLClient('/api/delete-playlist');
            await graphQLClient.request(deletePlaylist, { id: playlist.id });
        } catch (error) {
            throw Error(error);
        }
        Router.push('/');
        setDeleting(false);
    };

    const onCancel = async () => {
        Router.push('/');
    }

    const handleSetPlaylistRestrictionId = (name) => {
        const restriction = getRestrictionByName(name);
        setPlaylistRestrictionId(restriction.id);
    }

    const playlistNameHeader = playlistName ? `- ${playlistName}` : '';

    return (
        <form onSubmit={submitHandler}>
            <Header titleSuffix={playlistNameHeader} />
            <Container className={styles.content_container}>
                <Grid container>
                    <Grid item xs={12} lg={6}>
                        <TextField
                            id="playlistName"
                            label="Playlist Name"
                            value={playlistName}
                            onChange={e => setPlaylistName(e.target.value)}
                            required
                            fullWidth
                            autoComplete="off"
                            className={styles.default_bottom_margin}
                        />
                    </Grid>
                    <Grid item xs={12} lg={6} className={styles.text_align_right}>
                        <RestrictionSelection
                            id="playlist_restriction"
                            selectedRestrictionId={playlistRestrictionId}
                            onChange={handleSetPlaylistRestrictionId}
                        />
                    </Grid>
                </Grid>
                <Grid container item xs={12} lg={6}>
                    <TextField
                        id="playlistObservation"
                        label="Observation"
                        value={playlistObservation}
                        onChange={e => setPlaylistObservation(e.target.value)}
                        fullWidth
                        multiline
                        autoComplete="off"
                        className={styles.default_bottom_margin}
                    />
                </Grid>
                <PlaylistSongEntry
                    playlistEntries={playlistEntries}
                    setPlaylistEntries={setPlaylistEntries}
                />
                <div className={styles.fab_buttons}>
                    {playlist.id &&
                        <Fab
                            id="deletePlaylistButton"
                            aria-label="delete"
                            disabled={deleting}
                            onClick={removePlaylist}
                            variant="extended"
                        >
                            {'Delete'}
                        </Fab>
                    }
                    <Fab
                        id="savePlaylistButton"
                        color="primary"
                        aria-label="save"
                        type="submit"
                        disabled={submitting}
                        variant="extended"
                    >
                        {submitting ? 'Saving' : 'Save'}
                    </Fab>
                    <Fab
                        id="cancelPlaylistButton"
                        aria-label="cancel"
                        variant="extended"
                        onClick={onCancel}
                    >
                        {'Cancel'}
                    </Fab>
                </div>
            </Container>
        </form>
    );
}

export default PlaylistForm;