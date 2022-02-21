import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import { usePlaylistsState } from '@/lib/playlists-store';
import Playlist from '@/components/playlists/playlist';
import styles from '@/styles/general.module.css';

const Playlists = () => {
    const { playlists, isLoadingPlaylists } = usePlaylistsState();

    let playlistsData;
    if (isLoadingPlaylists) {
        const playlistPanelHeight = 80;
        const playlistsListSkeleton = new Array(4).fill().map((v, i) =>
            <Skeleton key={i} variant="rect" height={playlistPanelHeight} className={styles.playlists_skeleton} />
        );
        playlistsData = (
            <Container className={styles.content_container}>
                {playlistsListSkeleton}
            </Container>
        )
    } else {
        playlistsData = (
            <Container>
                {playlists.map(playlist => (
                    <div key={playlist.id}>
                        <Playlist playlist={playlist} />
                    </div>
                ))}
            </Container>
        )
    }

    return playlistsData;
}

export default Playlists;

