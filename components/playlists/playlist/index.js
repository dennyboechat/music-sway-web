import Song from '@/components/songs/song';
import Container from '@mui/material/Container';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import { useAuthProvider } from '@/lib/auth-provider';
import { orderBy } from 'lodash';
import styles from '@/styles/general.module.css';

const Playlist = ({ playlist }) => {
    const { loggedUser } = useAuthProvider();

    if (!playlist) {
        return null;
    }

    let songsTotalLabel;
    let playlistEntries;
    if (playlist.entries && playlist.entries.length) {
        playlistEntries = orderBy(playlist.entries, ['orderIndex']);
        if (playlistEntries.length === 1) {
            songsTotalLabel = '1 song';
        } else {
            songsTotalLabel = `${playlistEntries.length} songs`;
        }
    } else {
        songsTotalLabel = 'No song';
    }

    const isPlaylistOwner = Number(loggedUser.user.id) === playlist.ownerId;
    const playlistSubText = songsTotalLabel + (isPlaylistOwner ? '' : ` by ${playlist.ownerName}`);

    return (
        <Container>
            <Accordion id={playlist.id} className="playlist_accordion">
                <AccordionSummary
                    id={`${playlist.id}-summary`}
                    expandIcon={<ExpandMoreIcon />}
                >
                    <div className={styles.song_card_title_header}>
                        <Typography component="h4">
                            {playlist.name}
                        </Typography>
                        <Typography variant="caption" display="block" gutterBottom color="textSecondary">
                            {playlistSubText}
                        </Typography>
                        <Typography variant="caption" display="block" gutterBottom color="textSecondary">
                            {playlist.observation}
                        </Typography>
                    </div>
                </AccordionSummary>
                <AccordionDetails className={styles.playlist_accordion_details}>
                    {isPlaylistOwner &&
                        <IconButton
                            id={`${playlist.id}_editButton`}
                            href={`/playlist/${playlist.id}`}
                            title="Edit Playlist"
                            color="primary"
                        >
                            <EditIcon />
                        </IconButton>
                    }
                    {playlistEntries && playlistEntries.map(playlistEntry => (
                        <div key={playlistEntry.id}>
                            <Song song={playlistEntry.song} />
                        </div>
                    ))}
                </AccordionDetails>
            </Accordion>
        </Container>
    );
}

export default Playlist;