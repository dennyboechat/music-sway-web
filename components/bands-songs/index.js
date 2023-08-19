import React from 'react';
import Router from 'next/router'
import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';
import FloatingButton from '@/components/floating-button';
import HeaderPanel from '@/components/header/header-panel';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useBandsSongsState } from '@/lib/bands-songs-store';
import styles from '@/styles/general.module.css';
import Song from '@/components/songs/song';
import { SearchInput } from '@/components/songs/filter';
import { useSongsFilterState } from '@/lib/songsFilter-store';
import { filterSongs } from '@/lib/utils';
import { cloneDeep, forEach, remove, orderBy } from 'lodash';
import { useMessageState } from '@/lib/message-store';
import { copySongs } from '@/graphQl/mutations';
import { GraphQLClient } from 'graphql-request';
import { songsQuery } from '@/graphQl/queries';
import { useSWRConfig } from 'swr';

const BandsSongs = () => {
    const { bandsSongs, isLoadingBandsSongs } = useBandsSongsState();
    const { songsFilterValue, setSongsFilterValue } = useSongsFilterState();
    const [selectedSongs, setSelectedSongs] = React.useState([]);
    const { setAlertMessage } = useMessageState();
    const [isCopying, setIsCopying] = React.useState(false);
    const { mutate } = useSWRConfig();

    React.useEffect(() => {
        setSongsFilterValue('');
    }, [setSongsFilterValue]);

    const onCopySelectedSongs = () => async () => {
        if (!selectedSongs || !selectedSongs.length) {
            return;
        }
        setIsCopying(true);
        const songsIds = [];
        forEach(selectedSongs, song => {
            songsIds.push(Number(song.id));
        });
        try {
            const graphQLClient = new GraphQLClient('/api/copy-songs');
            await graphQLClient.request(copySongs, { ids: songsIds });
        } catch (error) {
            throw Error(error);
        }
        mutate(songsQuery);
        Router.push('/');
        setIsCopying(false);
        setSelectedSongs([]);
        setAlertMessage({ message: `Songs copied. They are yours now!`, severity: 'success' });
    };

    let songsList;
    if (isLoadingBandsSongs) {
        const songsListSkeleton = new Array(15).fill().map((v, i) =>
            <Skeleton key={i} variant="rectangular" height={60} className={styles.songs_list_skeleton} />
        );
        songsList = (
            <Container className={styles.content_container}>
                {songsListSkeleton}
            </Container>
        )
    } else {
        if (bandsSongs && bandsSongs.length) {
            const onSelectSong = ({ song, selected }) => {
                let selectedSongsCopy = cloneDeep(selectedSongs);
                if (selected) {
                    selectedSongsCopy.push(song);
                } else {
                    remove(selectedSongsCopy, { id: song.id });
                }
                setSelectedSongs(selectedSongsCopy);
            }
            let sortedSongs = filterSongs({ songs: bandsSongs, songsFilterValue });
            sortedSongs = orderBy(sortedSongs, ['ownerName']);
            songsList = [];
            let owner;
            forEach(sortedSongs, song => {
                if (owner != song.ownerName) {
                    songsList.push(
                        <h4>{song.ownerName}</h4>
                    );
                    owner = song.ownerName;
                }
                songsList.push(
                    <div key={song.id}>
                        <Song
                            song={song}
                            onSelectSong={onSelectSong}
                            disableSelectSong={isCopying}
                        />
                    </div>
                );
            });
        } else {
            songsList = 'No songs shared from your band(s).';
        }
    }

    return (
        <>
            <HeaderPanel>
                <SearchInput />
            </HeaderPanel>
            <Container className={styles.content_container}>
                {songsList}
                <div className={styles.fab_buttons}>
                    <FloatingButton
                        id="copySelectedSongsButton"
                        aria-label="CopySelectedSongs"
                        onClick={onCopySelectedSongs()}
                        label="Copy to My Songs"
                        icon={<ContentCopyIcon />}
                        disabled={isCopying || !selectedSongs || !selectedSongs.length}
                    />
                </div>
            </Container>
        </>
    );
}

export default BandsSongs;