import React from "react";
import Skeleton from '@mui/material/Skeleton';
import { ReactSortable } from "react-sortablejs";
import { useSongsState } from '@/lib/songs-store';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 } from 'uuid';
import styles from '@/styles/general.module.css';
import { orderBy, filter, forEach, remove } from 'lodash';
import FilterInput from '@/components/filter-input';
import { filterSongs } from '@/lib/utils';
import { deepOrange } from '@mui/material/colors';

const PlaylistSongEntry = ({ playlistEntries, setPlaylistEntries, disabledButtons = false }) => {
    const { songs, isLoadingSongs } = useSongsState();
    const [songsFilterValue, setSongsFilterValue] = React.useState('');

    let entries = orderBy(playlistEntries, ['orderIndex']);
    let entryDetails = [];
    let songsList;

    const getSongDisplayData = (item) => {
        let songsFound = filter(entries, entry => { return entry.songId === item.id });
        if (songsFound && songsFound.length) {
            const avatarBackgroundColor = songsFound.length > 1 ? deepOrange[500] : null;
            songsFound = (
                <Avatar
                    sx={{ width: 20, height: 20, bgcolor: avatarBackgroundColor }}
                    className={styles.avatar_small_font}
                >
                    {songsFound.length}
                </Avatar>
            );
        } else {
            songsFound = null;
        }
        return (
            <div
                key={item.id}
                className={styles.playlist_entry_toggle}
            >
                <div>
                    {item.title}
                    <Typography variant="caption" display="block" gutterBottom color="textSecondary">
                        {item.artist}
                    </Typography>
                </div>
                {songsFound}
            </div>
        );
    }

    if (isLoadingSongs) {
        songsList = new Array(8).fill().map((v, i) =>
            <Skeleton key={i} variant="rect" height={70} className={styles.songs_list_skeleton} />
        );
    } else {
        if (songs) {
            if (entries) {
                forEach(entries, entry => {
                    const foundSong = songs.find(song => song.id === entry.songId);
                    if (foundSong) {
                        entryDetails.push(
                            <div
                                key={entry.id}
                                id={entry.id}
                                className={styles.playlist_entry_toggle}
                            >
                                <div>
                                    {foundSong.title}
                                    <Typography variant="caption" display="block" gutterBottom color="textSecondary">
                                        {foundSong.artist}
                                    </Typography>
                                </div>
                                <IconButton
                                    id={`deleteEntry_${entry.id}`}
                                    onClick={() => removePlaylistEntry({ entryId: entry.id })}
                                    className={styles.playlist_entry_toggle_delete_button}
                                    disabled={disabledButtons}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                        );
                    }
                });
            }

            const filteredSongs = filterSongs({ songs, songsFilterValue });

            songsList = (
                <div>
                    <FilterInput
                        id="filterSongForPlaylist"
                        placeholder="title, artist, content ..."
                        value={songsFilterValue}
                        setValue={setSongsFilterValue}
                    />
                    <ReactSortable
                        list={filteredSongs}
                        setList={() => { }}
                        group={{
                            name: 'songs',
                            pull: 'clone',
                            put: false,
                        }}
                        animation={200}
                        delayOnTouchStart={true}
                        delay={2}
                        sort={false}
                        className={styles.playlist_pick_songs}
                        disabled={disabledButtons}
                    >
                        {filteredSongs.map(item => getSongDisplayData(item))}
                    </ReactSortable>
                </div>
            );
        } else {
            songsList = 'No songs to be added to the playlist.';
        }
    }

    const addPlaylistEntry = (items) => {
        setPlaylistEntries(items.map((item, index) => ({ ...item, songId: item.songId, orderIndex: index + 1 })));
    }

    const removePlaylistEntry = ({ entryId }) => {
        remove(entries, entry => { return entry.id === entryId; });
        setPlaylistEntries(entries);
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                {songsList}
            </Grid>
            <Grid item xs={6}>
                <div className={styles.playlist_songs_title}>
                    <Typography color="primary">
                        {'Playlist Songs'}
                    </Typography>
                    <Typography variant="caption" display="block" gutterBottom color="textSecondary">
                        {'(drag and drop the songs bellow)'}
                    </Typography>
                </div>
                {entries &&
                    <ReactSortable
                        list={entries}
                        setList={items => addPlaylistEntry(items)}
                        group={{
                            name: 'songs',
                            pull: false,
                        }}
                        animation={200}
                        delayOnTouchStart={true}
                        delay={2}
                        className={styles.playlist_entry_drag_drop}
                        ghostClass={styles.playlist_entry_drag_drop_item}
                        chosenClass={styles.playlist_entry_drag_item}
                        clone={item => ({ ...item, id: v4(), songId: item.id })}
                        disabled={disabledButtons}
                    >
                        {entryDetails}
                    </ReactSortable>
                }
            </Grid>
        </Grid >
    );
};

export default PlaylistSongEntry;