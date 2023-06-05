import React from "react";
import Container from '@mui/material/Container';
import SongForm from '@/components/song-form';
import LoadingSong from '@/components/edit-song-form/loading-song';
import HeaderPanel from '@/components/header/header-panel';
import styles from '@/styles/general.module.css';
import { useSong } from '@/lib/swr-hooks';

const EditSongPage = ({ songId }: { songId: number }) => {
    const { song, isLoadingSong } = useSong(songId);

    if (isLoadingSong) {
        return (
            <>
                <HeaderPanel />
                <LoadingSong />
            </>
        );
    }

    let songForm;
    if (song) {
        songForm = <SongForm song={song} apiEndpoint="/api/edit-song" />;
    } else {
        <Container className={styles.content_container}>
            songForm = <span>{'Song not found or you have no access.'}</span>;
        </Container>
    }

    return (
        <>
            <HeaderPanel />
            {songForm}
        </>
    );
}

export default EditSongPage;