import React from 'react';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import RichTextEditor from '@/components/rich-text-editor';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSongsState } from '@/lib/songs-store';
import { uniq, map, forEach, without, orderBy } from 'lodash';
import styles from '@/styles/general.module.css';
import classnames from 'classnames';

const SongEntryForm = ({ entry, onValueChanged, onRemoveSong }) => {
    const { songs } = useSongsState();
    const [wrapperClassName, setWrapperClassName] = React.useState();

    let entryTitles = [];
    if (songs && songs.length) {
        forEach(songs, s => {
            entryTitles = map(s.entries, e => { return e.title; });
        })
        entryTitles = uniq(without(entryTitles, null, undefined, ''));
        entryTitles = orderBy(entryTitles);
    }

    const onMouseOverDeleteButton = () => {
        setWrapperClassName(styles.song_entry_form_wrapper_highlighted);
    };

    const onMouseOutDeleteButton = () => {
        setWrapperClassName(null);
    };

    const className = classnames(styles.default_bottom_margin, wrapperClassName);

    return (
        <div key={entry.uuid} className={className}>
            <Grid container>
                <Grid item xs={12} lg={6} className={styles.default_half_bottom_margin}>
                    <Autocomplete
                        id={`entryTitleAutoComplete_${entry.uuid}`}
                        freeSolo
                        options={entryTitles}
                        inputValue={entry.title}
                        onInputChange={(e, value) => onValueChanged({ field: 'title', value, entry })}
                        fullWidth
                        renderInput={(params) => (
                            <TextField
                                id={`entryTitle_${entry.uuid}`}
                                label="Section Header"
                                {...params}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} lg={6} className={styles.text_align_right}>
                    <Button
                        id={`deleteEntry_${entry.uuid}`}
                        onClick={() => onRemoveSong({ entry })}
                        onMouseOver={() => onMouseOverDeleteButton()}
                        onMouseOut={() => onMouseOutDeleteButton()}
                        variant="outlined"
                        startIcon={<DeleteIcon />}
                    >
                        {'Delete Section'}
                    </Button>
                </Grid>
            </Grid>
            <RichTextEditor
                id={`entryContent_${entry.uuid}`}
                value={entry.content}
                onChange={(value) => onValueChanged({ field: 'content', value, entry })}
            />
        </div>
    );
}

export default SongEntryForm;