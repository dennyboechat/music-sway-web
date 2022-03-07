import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import FlipIcon from '@mui/icons-material/Flip';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import HtmlParser from '@/components/html-parser';
import styles from '@/styles/general.module.css';
import { autoPageScrollDownStart, autoPageScrollDownStop } from '@/lib/utils';
import { useConfigurationState } from '@/lib/configuration-store';

const Song = ({ song }) => {
  const [splitContent, setSplitContent] = React.useState(false);
  const { autoScrollContentSpeed, setAutoScrollContentSpeed } = useConfigurationState();

  const cardHeader = (
    <div className={styles.song_card_header}>
      <div className={styles.song_card_title_header}>
        <Typography component="h4" color="primary">
          {song.title}
        </Typography>
        <Typography variant="caption" display="block" gutterBottom color="textSecondary">
          {song.artist}
        </Typography>
      </div>
    </div>
  );

  const scrollContent = ({ speedUp }) => {
    let scrollDown;
    if (speedUp) {
      if (autoScrollContentSpeed) {
        scrollDown = autoScrollContentSpeed - 20;
      } else {
        scrollDown = 100;
      }
    } else {
      scrollDown = autoScrollContentSpeed === 100 ? 0 : autoScrollContentSpeed + 20;
    }
    setAutoScrollContentSpeed(scrollDown);
    if (scrollDown) {
      autoPageScrollDownStop();
      autoPageScrollDownStart(scrollDown);
    } else {
      autoPageScrollDownStop();
    }
  }

  let cardContent;
  if (song.entries && song.entries.length) {
    const firstEntry = song.entries[0];

    let autoScrollContentSpeedIcon;
    let autoScrollContentSpeedLabel;

    if (autoScrollContentSpeed) {
      switch (autoScrollContentSpeed) {
        case 100:
          autoScrollContentSpeedLabel = '1';
          break;
        case 80:
          autoScrollContentSpeedLabel = '2';
          break;
        case 60:
          autoScrollContentSpeedLabel = '3';
          break;
        case 40:
          autoScrollContentSpeedLabel = '4';
          break;
        case 20:
          autoScrollContentSpeedLabel = '5';
          break;
      }
      autoScrollContentSpeedIcon = <AddIcon />;
      autoScrollContentSpeedLabel = (
        <>
          <label>{autoScrollContentSpeedLabel}</label>
          <IconButton
            id={`${song.id}_scrollDownSpeedDownButton`}
            title="Auto Scroll Content"
            onClick={() => scrollContent({ speedUp: false })}
            color="primary"
          >
            <RemoveIcon />
          </IconButton>
        </>
      );
    } else {
      autoScrollContentSpeedIcon = <KeyboardDoubleArrowDownIcon />;
    }

    const actions = (
      <div className={styles.song_card_actions}>
        <IconButton
          id={`${song.id}_editButton`}
          href={`/song/${song.id}`}
          title="Edit Song"
          color="primary"
        >
          <EditIcon />
        </IconButton>
        <IconButton
          id={`${song.id}_splitContentButton`}
          title="Split Content"
          onClick={() => setSplitContent(!splitContent)}
          color="primary"
        >
          <FlipIcon />
        </IconButton>
        <IconButton
          id={`${song.id}_scrollDownSpeedUpButton`}
          title="Auto Scroll Content"
          onClick={() => scrollContent({ speedUp: true })}
          color="primary"
          disabled={autoScrollContentSpeed === 20}
        >
          {autoScrollContentSpeedIcon}
        </IconButton>
        {autoScrollContentSpeedLabel}
      </div>
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
            <HtmlParser content={firstEntry.content} className={splitContent ? styles.song_card_content_split : ''} />
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
                <HtmlParser content={entry.content} className={splitContent ? styles.song_card_content_split : ''} />
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