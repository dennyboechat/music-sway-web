import { useRouter } from 'next/router';
import EditSongForm from '@/components/edit-song-form';
import LoadingSong from '@/components/edit-song-form/loading-song';

const EditSongPage = () => {
    const router = useRouter();
    
    if (router.isReady && router.query && router.query.id) {
        const songId = Number(router.query.id);
        return <EditSongForm songId={songId} />;
    } else {
        return <LoadingSong />;
    }
}

export default EditSongPage;