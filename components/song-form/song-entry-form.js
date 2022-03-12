import React from 'react';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import RichTextEditor from '@/components/rich-text-editor';
import { useSongsState } from '@/lib/songs-store';
import { uniq, map, filter, forEach, without } from 'lodash';

const SongEntryForm = ({ entries, setEntries, entry }) => {

    const { songs } = useSongsState();

    const onValueChanged = ({ field, value }) => {
        const entriesCopy = entries.map(obj => obj.uuid === entry.uuid ? { ...obj, [field]: value } : obj);
        setEntries(entriesCopy);
    };

    const onDeleteEntry = () => {
        const entriesCopy = filter(entries, e => { return e.uuid !== entry.uuid });
        setEntries(entriesCopy);
    };

    let entryTitles = [];
    if (songs && songs.length) {
        forEach(songs, s => {
            entryTitles = map(s.entries, e => { return e.title; });
        })
        entryTitles = uniq(without(entryTitles, null, undefined));
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
                        onInputChange={(e, value) => onValueChanged({ field: 'title', value })}
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
                    <Button id={`deleteEntry_${entry.uuid}`} onClick={onDeleteEntry}>
                        {'Delete'}
                    </Button>
                </Grid>
            </Grid>
            <RichTextEditor
                id={`entryContent_${entry.uuid}`}
                value={entry.content}
                onChange={(value) => onValueChanged({ field: 'content', value })}
            />
        </div>
    );
}

export default SongEntryForm;