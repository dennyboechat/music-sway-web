import React from 'react';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import RichTextEditor from '@/components/rich-text-editor';
import { useSongsState } from '@/lib/songs-store';
import { uniq, map, filter, forEach, without } from 'lodash';

const SongEntryForm = ({ entries, setEntries, entry, index }) => {

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
        <div key={index}>
            <Grid container>
                <Grid container item xs={12} lg={6}>
                    <Autocomplete
                        id={`entryTitleAutoComplete_${index}`}
                        freeSolo
                        options={entryTitles}
                        inputValue={entry.title}
                        onInputChange={(e, value) => onValueChanged({ field: 'title', value })}
                        fullWidth
                        renderInput={(params) => (
                            <TextField
                                id={`entryTitle_${index}`}
                                label="Section Header"
                                {...params}
                            />
                        )}
                    />
                </Grid>
                <Grid container item xs={12} lg={6}>
                    <Button id="deleteEntry" onClick={onDeleteEntry}>
                        {'Delete'}
                    </Button>
                </Grid>
            </Grid>
            <RichTextEditor
                id={`entryContent_${index}`}
                value={entry.content}
                onChange={(value) => onValueChanged({ field: 'content', value })}
            />
        </div>
    );
}

export default SongEntryForm;