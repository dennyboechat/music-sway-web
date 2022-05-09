import React from 'react';
import Router from 'next/router'
import Header from '@/components/header';
import SongEntryForm from '@/components/song-form/song-entry-form';
import RestrictionSelection from '@/components/restriction-selection';
import ConfirmButtonFab from '@/components/confirm-buttons/confirmButtonFab';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import DeleteIcon from '@mui/icons-material/Delete';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSongsState } from '@/lib/songs-store';
import styles from '@/styles/general.module.css';
import { v4 } from 'uuid';
import { uniqBy, map, without, pick, forEach, filter, cloneDeep, orderBy } from 'lodash';
import { getNewSongEntry, validateSong } from '@/lib/utils';
import Restriction, { getRestrictionByName } from '@/lib/restriction';
import { createSong, updateSong, deleteSong } from '@/graphQl/mutations';
import { GraphQLClient } from 'graphql-request';
import { useSWRConfig } from 'swr';
import { songsQuery } from '@/graphQl/queries';

const SongForm = ({ song, apiEndpoint }) => {
    const { songs } = useSongsState();
    const [songTitle, setSongTitle] = React.useState(song?.title);
    const [songArtist, setSongArtist] = React.useState(song?.artist);
    const [songCategory, setSongCategory] = React.useState(song?.category);
    const [songObservation, setSongObservation] = React.useState(song?.observation);
    const [songRestrictionId, setSongRestrictionId] = React.useState(song?.restrictionId);
    const [songEntries, setSongEntries] = React.useState(song.entries || []);
    const [saving, setSaving] = React.useState(false);
    const [savingAndAddingNew, setSavingAndAddingNew] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);
    const [canceling, setCanceling] = React.useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false);
    const isLgResolution = useMediaQuery((theme) => theme.breakpoints.up('lg'));
    const { mutate } = useSWRConfig();

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

    const onSave = ({ addsNew }) => async () => {
        const invalidMessages = validateSong({ songTitle, songRestrictionId });
        if (invalidMessages.length) {
            console.error('Missing mandatory fields: ' + invalidMessages.join(', '));
            return;
        }

        if (addsNew) {
            setSavingAndAddingNew(true);
        } else {
            setSaving(true);
        }

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

        mutate(songsQuery);

        if (addsNew) {
            Router.push('/song/new');

            setSongTitle('');
            setSongArtist('');
            setSongCategory('');
            setSongObservation('');
            setSongRestrictionId(Restriction.PUBLIC.id);
            setSongEntries([getNewSongEntry()]);

            setSavingAndAddingNew(false);
        } else {
            Router.push('/');
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
            const graphQLClient = new GraphQLClient('/api/delete-song');
            await graphQLClient.request(deleteSong, { id: song.id });
        } catch (error) {
            throw Error(error);
        }
        mutate(songsQuery);
        Router.push('/');
        setDeleting(false);
    };

    const onCancel = async () => {
        setCanceling(true);
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
        artists = orderBy(artists);
        categories = without(map(uniqBy(songs, s => { return s.category; }), 'category'), null, undefined, '');
        categories = orderBy(categories);
    }

    const handleSetSongRestrictionId = (name) => {
        const restriction = getRestrictionByName(name);
        setSongRestrictionId(restriction.id);
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
        saveAndAddNewButton = (
            <Fab
                id="saveAndAddNewSongButton"
                color="primary"
                aria-label="saveAndAddNew"
                disabled={disabled}
                variant="extended"
                onClick={onSave({ addsNew: true })}
            >
                <SaveAsIcon />
                {buttonLabel}
            </Fab>
        );
    }

    let deleteButton;
    if (song.id) {
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
                <Fab
                    id="deleteSongButton"
                    color="secondary"
                    aria-label="delete"
                    onClick={onDelete}
                    variant="extended"
                    disabled={disabled}
                >
                    <DeleteIcon />
                    {'Delete'}
                </Fab>
            );
        }
    }

    const songTitleHeader = songTitle ? `- ${songTitle}` : '';
    const columnDirection = isLgResolution ? 'row' : 'column-reverse';

    return (
        <form>
            <Header titleSuffix={songTitleHeader} />
            <Container className={styles.content_container}>
                <Grid container direction={columnDirection}>
                    <Grid item xs={12} lg={6}>
                        <TextField
                            id="songTitle"
                            label="Song Title"
                            value={songTitle}
                            onChange={e => setSongTitle(e.target.value)}
                            required
                            fullWidth
                            autoFocus
                            autoComplete="off"
                            className="default_bottom_margin"
                            inputProps={{ maxLength: 255 }}
                        />
                    </Grid>
                    <Grid item xs={12} lg={6} className={styles.text_align_right}>
                        <RestrictionSelection
                            id="song_restriction"
                            selectedRestrictionId={songRestrictionId}
                            onChange={handleSetSongRestrictionId}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={12} lg={6}>
                    <Autocomplete
                        id="artistAutocomplete"
                        freeSolo
                        options={artists}
                        inputValue={songArtist || ''}
                        onInputChange={(e, value) => setSongArtist(value)}
                        fullWidth
                        className="default_bottom_margin"
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                id="artist"
                                label="Artist"
                                InputProps={{
                                    ...params.InputProps,
                                    inputProps: { ...params.inputProps, maxLength: 255 }
                                }}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} lg={6}>
                    <Autocomplete
                        id="categoryAutocomplete"
                        freeSolo
                        options={categories}
                        inputValue={songCategory || ''}
                        onInputChange={(e, value) => setSongCategory(value)}
                        fullWidth
                        className="default_bottom_margin"
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                id="category"
                                label="Category"
                                InputProps={{
                                    ...params.InputProps,
                                    inputProps: { ...params.inputProps, maxLength: 255 }
                                }}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} lg={6}>
                    <TextField
                        id="songObservation"
                        label="Observation"
                        value={songObservation}
                        onChange={e => setSongObservation(e.target.value)}
                        fullWidth
                        multiline
                        autoComplete="off"
                        className="default_bottom_margin"
                        inputProps={{ maxLength: 2550 }}
                    />
                </Grid>
                <Grid item xs={12}>
                    {
                        songEntries.map(entry => (
                            <SongEntryForm
                                key={entry.uuid}
                                onValueChanged={onSongEntryValueChanged}
                                onRemoveSong={onRemoveSongEntry}
                                entry={entry}
                                disabledButtons={disabled}
                            />
                        ))
                    }
                </Grid>
                <Grid item xs={12} className={styles.text_align_right}>
                    <Button
                        id="addEntry"
                        onClick={addEntry}
                        variant="outlined"
                        startIcon={<AddIcon />}
                        disabled={disabled}
                    >
                        {'Add Section'}
                    </Button>
                </Grid>
                <div className={styles.fab_buttons}>
                    {deleteButton}
                    {!showDeleteConfirmation &&
                        <Fab
                            id="saveSongButton"
                            color="primary"
                            aria-label="save"
                            variant="extended"
                            disabled={disabled}
                            onClick={onSave({ addsNew: false })}
                        >
                            <SaveIcon />
                            {saving ? 'Saving' : 'Save'}
                        </Fab>
                    }
                    {saveAndAddNewButton}
                    {!showDeleteConfirmation &&
                        <Fab
                            id="cancelSongButton"
                            color="secondary"
                            aria-label="cancel"
                            variant="extended"
                            onClick={onCancel}
                            disabled={disabled}
                        >
                            <HighlightOffIcon />
                            {'Cancel'}
                        </Fab>
                    }
                </div>
            </Container>
        </form>
    );
}

export default SongForm;