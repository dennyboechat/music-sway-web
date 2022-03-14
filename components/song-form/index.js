import React from 'react';
import Router from 'next/router'
import Header from '@/components/header';
import SongEntryForm from '@/components/song-form/song-entry-form';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useSongsState } from '@/lib/songs-store';
import styles from '@/styles/general.module.css';
import { v4 } from 'uuid';
import { uniqBy, map, without, pick, forEach, filter, cloneDeep } from 'lodash';
import { getNewSongEntry, validateSong } from '@/lib/utils';
import { getRestrictions, getRestrictionByName, getRestrictionById } from '@/lib/restriction';
import { createSong, updateSong, deleteSong } from '@/graphQl/mutations';
import { GraphQLClient } from 'graphql-request';

const SongForm = ({ song, apiEndpoint }) => {
    const { songs } = useSongsState();
    const [songTitle, setSongTitle] = React.useState(song?.title);
    const [songArtist, setSongArtist] = React.useState(song?.artist);
    const [songCategory, setSongCategory] = React.useState(song?.category);
    const [songObservation, setSongObservation] = React.useState(song?.observation);
    const [songRestrictionId, setSongRestrictionId] = React.useState(song?.restrictionId);
    const [songEntries, setSongEntries] = React.useState(song.entries || []);
    const [submitting, setSubmitting] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);

    if (!song) {
        return null;
    }

    if (songEntries && songEntries.length) {
        forEach(songEntries, songEntry => {
            if (!songEntry.uuid) {
                songEntry.uuid = v4();
            }
        });
    }

    const addEntry = () => {
        let entries = [...songEntries];
        entries.push(getNewSongEntry());
        setSongEntries(entries);
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const invalidMessages = validateSong({ songTitle, songRestrictionId });
        if (invalidMessages.length) {
            console.error('Missing mandatory fields: ' + invalidMessages.join(', '));
            return;
        }
        setSubmitting(true);

        const entries = songEntries.map(obj => pick(obj, ['title', 'content']));

        let variables = {
            input: {
                title: songTitle.trim(),
                artist: songArtist ? songArtist.trim() : null,
                category: songCategory ? songCategory.trim() : null,
                observation: songObservation,
                restrictionId: songRestrictionId,
                entries: entries,
            }
        }

        if (song.id) {
            variables.input.id = song.id;
        }

        try {
            const graphQLClient = new GraphQLClient(apiEndpoint);
            await graphQLClient.request(song.id ? updateSong : createSong, variables);
        } catch (error) {
            console.error(JSON.stringify(error, undefined, 2));
        }

        Router.push('/');
        setSubmitting(false);
    };

    const removeSong = async () => {
        setDeleting(true);
        try {
            const graphQLClient = new GraphQLClient('/api/delete-song');
            await graphQLClient.request(deleteSong, { id: song.id });
        } catch (error) {
            throw Error(error);
        }
        Router.push('/');
        setDeleting(false);
    };

    const onCancel = async () => {
        Router.push('/');
    }

    const onSongEntryValueChanged = ({ field, value, entry }) => {
        let entriesCopy = cloneDeep(songEntries);
        entriesCopy = entriesCopy.map(obj => obj.uuid === entry.uuid ? { ...obj, [field]: value } : obj);
        setSongEntries(entriesCopy);
    };

    const onRemoveSongEntry = ({ entry }) => {
        let entriesCopy = cloneDeep(songEntries);
        entriesCopy = filter(entriesCopy, e => { return e.uuid !== entry.uuid });
        setSongEntries(entriesCopy);
    };

    let artists = [];
    let categories = [];
    if (songs && songs.length) {
        artists = without(map(uniqBy(songs, s => { return s.artist; }), 'artist'), null, undefined, '');
        categories = without(map(uniqBy(songs, s => { return s.category; }), 'category'), null, undefined, '');
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

    const songRestrictionName = getRestrictionById(songRestrictionId).name;

    const handleSetSongRestrictionId = (name) => {
        const restriction = getRestrictionByName(name);
        setSongRestrictionId(restriction.id);
    }

    return (
        <form onSubmit={submitHandler}>
            <Header titleSuffix={`- ${songTitle}`} />
            <Container className={styles.content_container}>
                <RadioGroup
                    aria-label="song-restriction"
                    name="song-restriction-radio-buttons-group"
                    value={songRestrictionName}
                    onChange={(e, value) => handleSetSongRestrictionId(value)}
                >
                    {restrictions}
                </RadioGroup>
                <Grid container item xs={12} lg={6}>
                    <TextField
                        id="songTitle"
                        label="Song Title"
                        value={songTitle}
                        onChange={e => setSongTitle(e.target.value)}
                        required
                        fullWidth
                        autoComplete="off"
                    />
                </Grid>
                <Grid container item xs={12} lg={6}>
                    <Autocomplete
                        id="artistAutocomplete"
                        freeSolo
                        options={artists}
                        inputValue={songArtist || ''}
                        onInputChange={(e, value) => setSongArtist(value)}
                        fullWidth
                        renderInput={(params) => (
                            <TextField
                                id="artist"
                                label="Artist"
                                {...params}
                            />
                        )}
                    />
                </Grid>
                <Grid container item xs={12} lg={6}>
                    <Autocomplete
                        id="categoryAutocomplete"
                        freeSolo
                        options={categories}
                        inputValue={songCategory || ''}
                        onInputChange={(e, value) => setSongCategory(value)}
                        fullWidth
                        renderInput={(params) => (
                            <TextField
                                id="category"
                                label="Category"
                                {...params}
                            />
                        )}
                    />
                </Grid>
                <Grid container item xs={12} lg={6}>
                    <TextField
                        id="songObservation"
                        label="Observation"
                        value={songObservation}
                        onChange={e => setSongObservation(e.target.value)}
                        fullWidth
                        multiline
                        autoComplete="off"
                    />
                </Grid>
                {
                    songEntries.map(entry => (
                        <SongEntryForm
                            key={entry.uuid}
                            onValueChanged={onSongEntryValueChanged}
                            onRemoveSong={onRemoveSongEntry}
                            entry={entry}
                        />
                    ))
                }
                <Button id="addEntry" onClick={addEntry}>
                    {'Add Section'}
                </Button>
                <div className={styles.fab_buttons}>
                    {song.id &&
                        <Fab
                            id="deleteSongButton"
                            aria-label="delete"
                            disabled={deleting}
                            onClick={removeSong}
                            variant="extended"
                        >
                            {'Delete'}
                        </Fab>
                    }
                    <Fab
                        id="saveSongButton"
                        color="primary"
                        aria-label="save"
                        type="submit"
                        disabled={submitting}
                        variant="extended"
                    >
                        {submitting ? 'Saving' : 'Save'}
                    </Fab>
                    <Fab
                        id="cancelSongButton"
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

export default SongForm;