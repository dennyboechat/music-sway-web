import React from 'react';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import RichTextEditor from '@/components/rich-text-editor';
import { useSongsState } from '@/lib/songs-store';
import { uniq, map, forEach, without } from 'lodash';

const SongEntryForm = ({ entry, onValueChanged, onRemoveSong }) => {

    const { songs } = useSongsState();

    let entryTitles = [];
    if (songs && songs.length) {
        forEach(songs, s => {
            entryTitles = map(s.entries, e => { return e.title; });
        })
        entryTitles = uniq(without(entryTitles, null, undefined, ''));
    }

    return (
        <div key={entry.uuid}>
            <Grid container>
                <Grid container item xs={12} lg={6}>
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
                <Grid container item xs={12} lg={6}>
                    <Button
                        id={`deleteEntry_${entry.uuid}`}
                        onClick={() => onRemoveSong({ entry })}
                    >
                        {'Delete'}
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