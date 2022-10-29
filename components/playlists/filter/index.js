import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { usePlaylistsFilterState } from '@/lib/playlistsFilter-store';
import styles from '@/styles/general.module.css'

const PlaylistFilter = () => {
    const { playlistsFilterValue, setPlaylistsFilterValue } = usePlaylistsFilterState();

    return (
        <FormControlLabel
            className={styles.playlists_filter}
            control={
                <Checkbox
                    id={`playlistsFilterMyPlaylists`}
                    onChange={(e) => setPlaylistsFilterValue(e.target.checked)}
                    checked={playlistsFilterValue}
                />
            }
            label="My Playlists"
        />
    )
}

export default PlaylistFilter;