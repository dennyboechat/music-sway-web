import Song from '@/components/songs/song';
import Container from '@mui/material/Container';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import { orderBy } from 'lodash';
import styles from '@/styles/general.module.css';

const Playlist = ({ playlist }) => {

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

    return (
        <Container>
            <Accordion id={playlist.id} className={styles.playlist_accordion}>
                <AccordionSummary
                    id={`${playlist.id}-summary`}
                    expandIcon={<ExpandMoreIcon />}
                >
                    <div className={styles.song_card_title_header}>
                        <Typography component="h4">
                            <label>{playlist.name}</label>
                        </Typography>
                        <Typography variant="caption" display="block" gutterBottom color="textSecondary">
                            {songsTotalLabel}
                        </Typography>
                        <Typography variant="caption" display="block" gutterBottom color="textSecondary">
                            {playlist.observation}
                        </Typography>
                    </div>
                </AccordionSummary>
                <AccordionDetails className={styles.playlist_accordion_details}>
                    <Button
                        id={`${playlist.id}_editButton`}
                        href={`/playlist/${playlist.id}`}
                        title="Edit Playlist"
                    >
                        <EditIcon />
                    </Button>
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