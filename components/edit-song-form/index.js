import React from "react";
import { useSong } from '@/lib/swr-hooks';
import SongForm from '@/components/song-form';
import LoadingSong from '@/components/edit-song-form/loading-song';

const EditSongPage = ({ songId }) => {
    const { song, isLoadingSong } = useSong(songId);

    if (isLoadingSong) {
        return <LoadingSong />;
    }

    if (!song) {
        return <span>{'Song not found'}</span>;
    }

    return (
        <SongForm song={song} apiEndpoint="/api/edit-song" apiMethod="PATCH" />
    );
}

export default EditSongPage;