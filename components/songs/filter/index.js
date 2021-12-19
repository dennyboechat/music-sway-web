import React from 'react';
import { useSongsFilterState } from '@/lib/songsFilter-store';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import InputBase from '@mui/material/InputBase';
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
            <div className={styles.search_icon}>
                <SearchIcon />
            </div>
            <InputBase
                id="searchInput"
                placeholder="title, artist, content"
                classes={{
                    root: styles.input_root,
                    input: styles.input_input,
                }}
                inputProps={{ 'aria-label': 'search' }}
                value={songsFilterValue}
                onChange={e => { setSongsFilterValue(e.target.value) }}
                autoComplete='off'
                inputRef={inputRef}
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