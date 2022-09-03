import React from 'react';
import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';
import HeaderPanel from '@/components/header/header-panel';
import { useBandsSongsState } from '@/lib/bands-songs-store';
import styles from '@/styles/general.module.css';
import Song from '@/components/songs/song';
import Filter from '@/components/songs/filter';
import { useSongsFilterState } from '@/lib/songsFilter-store';
import { filterSongs } from '@/lib/utils';

const BandsSongs = ({ }) => {
    const { bandsSongs, isLoadingBandsSongs } = useBandsSongsState();
    const { songsFilterValue, setSongsFilterValue } = useSongsFilterState();

    React.useEffect(() => {
        setSongsFilterValue('');
    }, [setSongsFilterValue]);

    let songsList;
    if (isLoadingBandsSongs) {
        const songsListSkeleton = new Array(15).fill().map((v, i) =>
            <Skeleton key={i} variant="rect" height={60} className={styles.songs_list_skeleton} />
        );
        songsList = (
            <Container className={styles.content_container}>
                {songsListSkeleton}
            </Container>
        )
    } else {
        if (bandsSongs && bandsSongs.length) {
            const sortedSongs = filterSongs({ songs: bandsSongs, songsFilterValue });
            songsList = sortedSongs.map(song => (
                <div key={song.id}>
                    <Song song={song} />
                </div>
            ))
        } else {
            songsList = 'No songs shared from your band(s).';
        }
    }

    return (
        <>
            <HeaderPanel>
                <Filter />
            </HeaderPanel>
            <Container className={styles.content_container}>
                {songsList}
            </Container>
        </>
    );
}

export default BandsSongs;