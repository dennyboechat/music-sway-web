import React from 'react';
import { useSongsFilterState } from '@/lib/songsFilter-store';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import styles from '@/styles/general.module.css'

const SearchInput = () => {
    const { songsFilterValue, setSongsFilterValue } = useSongsFilterState();
    const inputRef = React.useRef(null);

    const onCleanButtonClick = () => {
        setSongsFilterValue('');
        if (inputRef && inputRef.current) {
            inputRef.current.focus();
        }
    }

    return (
        <div className={styles.search}>
            <TextField
                id="searchInput"
                placeholder="title, artist, content ..."
                autoComplete="off"
                autoFocus={true}
                value={songsFilterValue}
                variant="filled"
                fullWidth={true}
                onChange={e => { setSongsFilterValue(e.target.value) }}
                InputProps={{
                    startAdornment:
                        <InputAdornment position="start" className={styles.search_icon}>
                            <SearchIcon />
                        </InputAdornment>,
                    disableUnderline: true,
                    classes: {
                        input: styles.search_input,
                    }
                }}
            />
            {songsFilterValue && songsFilterValue.length > 0 &&
                <IconButton id="searchCleanButton" className={styles.icon_button} onClick={onCleanButtonClick}>
                    <CloseIcon />
                </IconButton>
            }
        </div>
    )
}

export default SearchInput;