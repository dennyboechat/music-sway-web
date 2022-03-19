import PlaylistForm from '@/components/playlist-form';
import HeaderPanel from '@/components/header/header-panel';
import { getNewPlaylist } from '@/lib/utils';

const NewPlaylistPage = () => {
    const playlist = getNewPlaylist();
    return (
        <>
            <HeaderPanel />
            <PlaylistForm playlist={playlist} apiEndpoint="/api/create-playlist" />
        </>
    );
}

export default NewPlaylistPage;