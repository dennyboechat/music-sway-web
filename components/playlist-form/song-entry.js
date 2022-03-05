import React from "react";
import Skeleton from '@mui/material/Skeleton';
import { ReactSortable } from "react-sortablejs";
import { useSongsState } from '@/lib/songs-store';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { v4 } from 'uuid';
import styles from '@/styles/general.module.css';
import { orderBy, forEach, remove } from 'lodash';
import FilterInput from '@/components/filter-input';
import { filterSongs } from '@/lib/utils';

const PlaylistSongEntry = ({ playlistEntries, setPlaylistEntries }) => {
    const { songs, isLoadingSongs } = useSongsState();
    const [songsFilterValue, setSongsFilterValue] = React.useState('');

    let entries = orderBy(playlistEntries, ['orderIndex']);
    let entryDetails = [];
    let songsList;

    if (isLoadingSongs) {
        songsList = new Array(8).fill().map((v, i) =>
            <Skeleton key={i} variant="rect" height={110} className={styles.songs_list_skeleton} />
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
                                {foundSong.title}
                                <Typography variant="caption" display="block" gutterBottom color="textSecondary">
                                    {foundSong.artist}
                                </Typography>
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
                    >
                        {filteredSongs.map((item) => (
                            <div
                                key={item.id}
                                className={styles.playlist_entry_toggle}
                            >
                                {item.title}
                                <Typography variant="caption" display="block" gutterBottom color="textSecondary">
                                    {item.artist}
                                </Typography>
                            </div>
                        ))}
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

    const removePlaylistEntry = (e) => {
        remove(entries, entry => { return entry.id === e.item.id; });
        setPlaylistEntries(entries);
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                {songsList}
            </Grid>
            <Grid item xs={6}>
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
                        clone={item => ({ ...item, id: v4(), songId: item.id })}
                        removeOnSpill={true}
                        onSpill={e => removePlaylistEntry(e)}
                    >
                        {entryDetails}
                    </ReactSortable>
                }
            </Grid>
        </Grid >
    );
};

export default PlaylistSongEntry;