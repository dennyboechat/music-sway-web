import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import HtmlParser from '@/components/html-parser';
import styles from '@/styles/general.module.css';

const Song = ({ song }) => {

  const cardHeader = (
    <div className={styles.song_card_header}>
      <div className={styles.song_card_title_header}>
        <Typography component="h4" color="primary">
          <label id={song.id}>
            {song.title}
          </label>
        </Typography>
        <Typography variant="caption" display="block" gutterBottom color="textSecondary">
          {song.artist}
        </Typography>
      </div>
    </div>
  );

  let cardContent;
  if (song.entries && song.entries.length > 0) {
    const firstEntry = song.entries[0];
    const actions = (
      <Link
        id={`${song.id}_editButton`}
        href={`/song/${song.id}`}
        title="Edit Song"
      >
        <EditIcon />
      </Link>
    );
    if (song.entries.length === 1 && (!firstEntry.title || firstEntry.title.trim.length)) {
      cardContent = (
        <Accordion id={`${song.id}-0`} className="ms-accordion single-no-title-entry">
          <AccordionSummary
            id={`${song.id}-${firstEntry.id}-summary`}
            expandIcon={<ExpandMoreIcon />}
          >
            {cardHeader}
          </AccordionSummary>
          <AccordionDetails>
            {actions}
            <HtmlParser content={firstEntry.content} />
          </AccordionDetails>
        </Accordion>
      );
    } else {
      cardContent = (
        <>
          {cardHeader}
          {song.entries && song.entries.map(entry => (
            <Accordion id={`${song.id}-${entry.id}`} key={`${song.id}-${entry.id}`} className="ms-accordion">
              <AccordionSummary
                id={`${song.id}-${entry.id}-summary`}
                expandIcon={<ExpandMoreIcon />}
              >
                <Typography className="ms-accordion-title">{entry.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {actions}
                <HtmlParser content={entry.content} />
              </AccordionDetails>
            </Accordion>
          ))
          }
        </>
      );
    }
  } else {
    cardContent = cardHeader;
  }

  return (
    <Card>
      <CardContent>
        {cardContent}
      </CardContent>
    </Card>
  );
}

export default Song;