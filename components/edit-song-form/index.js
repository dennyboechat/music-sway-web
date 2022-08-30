import React from "react";
import { useSong } from '@/lib/swr-hooks';
import SongForm from '@/components/song-form';
import LoadingSong from '@/components/edit-song-form/loading-song';
import HeaderPanel from '@/components/header/header-panel';

const EditSongPage = ({ songId }) => {
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
        songForm = <span>{'Song not found or you have no access.'}</span>;
    }

    return (
        <>
            <HeaderPanel />
            {songForm}
        </>
    );
}

export default EditSongPage;