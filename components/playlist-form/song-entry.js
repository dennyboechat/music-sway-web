import React from "react";
import Skeleton from '@mui/material/Skeleton';
import { ReactSortable } from "react-sortablejs";
import { useSongsState } from '@/lib/songs-store';
import Grid from '@mui/material/Grid';
import { v4 } from 'uuid';
import styles from '@/styles/general.module.css';
import { orderBy, forEach, remove } from 'lodash';

const PlaylistSongEntry = ({ playlistEntries, setPlaylistEntries }) => {
    const { songs, isLoadingSongs } = useSongsState();
    const [songsState, setSongsState] = React.useState();

    React.useEffect(() => {
        let existingSongs;
        if (songs && songs.length) {
            existingSongs = songs.map(song => (
                {
                    id: song.id,
                    name: song.title,
                }
            ));
            existingSongs = orderBy(existingSongs, ['name']);
        }
        setSongsState(existingSongs);
    }, [songs]);

    let entries = orderBy(playlistEntries, ['orderIndex']);
    let entryDetails = [];
    let songsList;

    if (isLoadingSongs) {
        songsList = new Array(8).fill().map((v, i) =>
            <Skeleton key={i} variant="rect" height={110} className={styles.songs_list_skeleton} />
        );
    } else {
        if (songsState) {
            if (entries) {
                forEach(entries, entry => {
                    const foundSong = songsState.find(song => song.id === entry.songId);
                    if (foundSong) {
                        entryDetails.push(
                            <div key={entry.id} id={entry.id}>
                                {foundSong.name}
                            </div>
                        );
                    }
                });
            }
            songsList = (
                <ReactSortable
                    list={songsState}
                    setList={setSongsState}
                    group={{
                        name: 'songs',
                        pull: 'clone',
                        put: false,
                    }}
                    animation={200}
                    delayOnTouchStart={true}
                    delay={2}
                    sort={false}
                >
                    {songsState.map((item) => (
                        <div key={item.id}>{item.name}</div>
                    ))}
                </ReactSortable>
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