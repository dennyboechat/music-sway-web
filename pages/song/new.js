import SongForm from '@/components/song-form';
import { getNewSong } from '@/lib/utils';

const NewSongPage = () => {
    const song = getNewSong({ addEntry: true });
    return (
        <SongForm song={song} apiEndpoint="/api/create-song" apiMethod="POST" />
    );
}

export default NewSongPage;