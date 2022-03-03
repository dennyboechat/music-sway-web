import { useRouter } from 'next/router';
import EditPlaylistForm from '@/components/edit-playlist-form';
import LoadingPlaylist from '@/components/edit-playlist-form/loading-playlist';

const EditPlaylistPage = () => {
    const router = useRouter();

    if (router.isReady && router.query && router.query.id) {
        const playlistId = Number(router.query.id);
        return <EditPlaylistForm playlistId={playlistId} />;
    } else {
        return <LoadingPlaylist />;
    }
}

export default EditPlaylistPage;