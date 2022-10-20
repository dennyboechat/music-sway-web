import React from 'react';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import RichTextEditor from '@/components/rich-text-editor';
import ConfirmButtonGroup from '@/components/confirm-buttons/confirmButtonGroup';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSongsState } from '@/lib/songs-store';
import { uniq, map, forEach, without, orderBy } from 'lodash';
import styles from '@/styles/general.module.css';
import classnames from 'classnames';

const SongEntryForm = ({ entry, onValueChanged, onRemoveSong, disabledButtons = false }) => {
    const { songs } = useSongsState();
    const [wrapperClassName, setWrapperClassName] = React.useState();
    const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false);
    const isLgResolution = useMediaQuery((theme) => theme.breakpoints.up('lg'));

    let entryTitles = [];
    if (songs && songs.length) {
        forEach(songs, s => {
            entryTitles = map(s.entries, e => { return e.title; });
        })
        entryTitles = uniq(without(entryTitles, null, undefined, ''));
        entryTitles = orderBy(entryTitles);
    }

    const onMouseOverDeleteButton = () => {
        setWrapperClassName('song_entry_form_wrapper_highlighted');
    };

    const onMouseOutDeleteButton = () => {
        setWrapperClassName(null);
    };

    const onDeleteEntry = () => {
        setShowDeleteConfirmation(true);
    };

    const onCancelDeleteEntry = () => {
        setShowDeleteConfirmation(false);
        setWrapperClassName('');
    };

    const onConfirmDeleteEntry = () => {
        onRemoveSong({ entry });
    }

    const className = classnames('default_bottom_margin', wrapperClassName);
    const columnDirection = isLgResolution ? 'row' : 'column-reverse';

    let deleteEntryButton;
    if (showDeleteConfirmation) {
        deleteEntryButton = (
            <ConfirmButtonGroup
                onConfirm={onConfirmDeleteEntry}
                onCancel={onCancelDeleteEntry}
                disabled={disabledButtons}
            />
        );
    } else {
        deleteEntryButton = (
            <Button
                id="deleteEntry"
                onClick={() => onDeleteEntry()}
                onMouseOver={() => onMouseOverDeleteButton()}
                onMouseOut={() => onMouseOutDeleteButton()}
                variant="outlined"
                startIcon={<DeleteIcon />}
                disabled={disabledButtons}
            >
                {'Delete Section'}
            </Button>
        );
    }

    return (
        <div key={entry.uuid} className={className}>
            <Grid container direction={columnDirection}>
                <Grid item xs={12} lg={6} className="default_half_bottom_margin">
                    <Autocomplete
                        id="entryTitleAutoComplete"
                        freeSolo
                        options={entryTitles}
                        inputValue={entry.title}
                        onInputChange={(e, value) => onValueChanged({ field: 'title', value, entry })}
                        fullWidth
                        className="default_bottom_margin"
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                id="entryTitle"
                                label="Section Header"
                                InputProps={{
                                    ...params.InputProps,
                                    inputProps: { ...params.inputProps, maxLength: 255 }
                                }}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} lg={6} className={styles.text_align_right}>
                    {deleteEntryButton}
                </Grid>
            </Grid>
            <RichTextEditor
                value={entry.content}
                onChange={(value) => onValueChanged({ field: 'content', value, entry })}
                className="song_entry_rich_text_editor_wrapper"
            />
        </div>
    );
}

export default SongEntryForm;