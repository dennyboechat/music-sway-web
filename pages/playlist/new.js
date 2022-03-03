import PlaylistForm from '@/components/playlist-form';
import { getNewPlaylist } from '@/lib/utils';

const NewPlaylistPage = () => {
    const playlist = getNewPlaylist();
    return (
        <PlaylistForm playlist={playlist} apiEndpoint="/api/create-playlist" />
    );
}

export default NewPlaylistPage;