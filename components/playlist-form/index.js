import React from 'react';
import Router from 'next/router'
import Header from '@/components/header';
import PlaylistSongEntry from '@/components/playlist-form/song-entry';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Fab from '@mui/material/Fab';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import styles from '@/styles/general.module.css';
import { forEach, pick } from 'lodash';
import { validatePlaylist } from '@/lib/utils';
import { getRestrictions, getRestrictionByName, getRestrictionById } from '@/lib/restriction';
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

    const restrictions = [];
    forEach(getRestrictions(), restriction => {
        restrictions.push(
            <FormControlLabel
                key={restriction.id}
                value={restriction.name}
                control={<Radio />}
                label={restriction.label}
            />
        );
    });

    const playlistRestrictionName = getRestrictionById(playlistRestrictionId).name;

    const handleSetPlaylistRestrictionId = (name) => {
        const restriction = getRestrictionByName(name);
        setPlaylistRestrictionId(restriction.id);
    }

    return (
        <form onSubmit={submitHandler}>
            <Header titleSuffix={`- ${playlistName}`} />
            <Container className={styles.content_container}>
                <RadioGroup
                    aria-label="playlist-restriction"
                    name="playlist-restriction-radio-buttons-group"
                    value={playlistRestrictionName}
                    onChange={(e, value) => handleSetPlaylistRestrictionId(value)}
                >
                    {restrictions}
                </RadioGroup>
                <Grid container item xs={12} lg={6}>
                    <TextField
                        id="playlistName"
                        label="Playlist Name"
                        value={playlistName}
                        onChange={e => setPlaylistName(e.target.value)}
                        required
                        fullWidth
                        autoComplete="off"
                    />
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