import SongForm from '@/components/song-form';
import { getNewSong } from '@/lib/utils';
import HeaderPanel from '@/components/header/header-panel';

const NewSongPage = () => {
    const song = getNewSong({ addEntry: true });
    return (
        <>
            <HeaderPanel />
            <SongForm song={song} apiEndpoint="/api/create-song" />
        </>
    );
}

export default NewSongPage;