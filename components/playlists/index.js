import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import { usePlaylistsState } from '@/lib/playlists-store';
import { usePlaylistsFilterState } from '@/lib/playlistsFilter-store';
import { useAuthProvider } from '@/lib/auth-provider';
import Playlist from '@/components/playlists/playlist';
import styles from '@/styles/general.module.css';

const Playlists = () => {
    const { playlists, isLoadingPlaylists } = usePlaylistsState();
    const { playlistsFilterValue } = usePlaylistsFilterState();
    const { loggedUser } = useAuthProvider();

    let playlistsData;
    if (isLoadingPlaylists) {
        const playlistsListSkeleton = new Array(4).fill().map((v, i) =>
            <Skeleton key={i} variant="rect" height={80} className={styles.playlists_skeleton} />
        );
        playlistsData = (
            <Container className={styles.content_container}>
                {playlistsListSkeleton}
            </Container>
        )
    } else {
        if (playlists && playlistsFilterValue) {
            playlists = playlists.filter(obj => { return obj.ownerId === Number(loggedUser.user.id); });
        }
        playlistsData = (
            <Container>
                {playlists && playlists.map(playlist => (
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

