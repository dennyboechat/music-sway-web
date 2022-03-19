import React from "react";
import { usePlaylist } from '@/lib/swr-hooks';
import HeaderPanel from '@/components/header/header-panel';
import PlaylistForm from '@/components/playlist-form';
import LoadingPlaylist from '@/components/edit-playlist-form/loading-playlist';
import { cloneDeep, forEach } from 'lodash';
import { v4 } from 'uuid';

const EditPlaylistPage = ({ playlistId }) => {
    const { playlist, isLoadingPlaylist } = usePlaylist(playlistId);

    if (isLoadingPlaylist) {
        return (
            <>
                <HeaderPanel />
                <LoadingPlaylist />
            </>
        );
    }

    if (!playlist) {
        return <span>{'Playlist not found'}</span>;
    }

    const playlistCopy = cloneDeep(playlist);
    if (playlistCopy.entries && playlistCopy.entries.length) {
        forEach(playlistCopy.entries, entry => {
            entry.id = v4();
            entry.songId = entry.song.id;
        });
    }

    return (
        <>
            <HeaderPanel />
            <PlaylistForm playlist={playlistCopy} apiEndpoint="/api/edit-playlist" />
        </>
    );
}

export default EditPlaylistPage;