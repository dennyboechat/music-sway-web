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

    let playlistForm;
    if (!playlist) {
        playlistForm = <span>{'Playlist not found or you have no access.'}</span>;
    } else {
        const playlistCopy = cloneDeep(playlist);
        if (playlistCopy.entries && playlistCopy.entries.length) {
            forEach(playlistCopy.entries, entry => {
                entry.id = v4();
                entry.songId = entry.song.id;
            });
        }
        playlistForm = <PlaylistForm playlist={playlistCopy} apiEndpoint="/api/edit-playlist" />;
    }

    return (
        <>
            <HeaderPanel />
            {playlistForm}
        </>
    );
}

export default EditPlaylistPage;