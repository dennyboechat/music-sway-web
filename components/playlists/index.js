import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import MsLogo from '@/components/ms-logo';
import { usePlaylistsState } from '@/lib/playlists-store';
import Playlist from '@/components/playlists/playlist';
import styles from '@/styles/general.module.css';

const Playlists = () => {
    const { playlists, isLoadingPlaylists } = usePlaylistsState();

    let playlistsData;
    if (isLoadingPlaylists) {
        const playlistPanelHeight = 110;
        const playlistsListSkeleton = new Array(8).fill().map((v, i) =>
            <Skeleton key={i} variant="rect" height={playlistPanelHeight} className={styles.playlists_list_skeleton} />
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

    return (
        <div>
            <div className={styles.playlists_header}>
                <span className={styles.header_logo}>
                    <MsLogo />
                </span>
                <div className={styles.header_title} />
            </div>
            {playlistsData}
        </div>
    );
}

export default Playlists;

