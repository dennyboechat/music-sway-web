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

    if (!song) {
        return <span>{'Song not found'}</span>;
    }

    return (
        <>
            <HeaderPanel />
            <SongForm song={song} apiEndpoint="/api/edit-song" />
        </>
    );
}

export default EditSongPage;