import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Checkbox from '@mui/material/Checkbox';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import FlipIcon from '@mui/icons-material/Flip';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import TextDecreaseIcon from '@mui/icons-material/TextDecrease';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import HtmlParser from '@/components/html-parser';
import styles from '@/styles/general.module.css';
import { autoPageScrollDownStart, autoPageScrollDownStop } from '@/lib/utils';
import { useConfigurationState } from '@/lib/configuration-store';
import { useAuthProvider } from '@/lib/auth-provider';

const AUTO_SCROLL_NO_SPEED = 0;
const AUTO_SCROLL_FIRST_SPEED = 100;
const AUTO_SCROLL_SPEED_BREAK = 20;
const FONT_SIZE_BREAK = 2;
const FONT_SIZE_DECREASE_LIMIT = 8;

const Song = ({ song, onSelectSong, disableSelectSong }) => {
  const { loggedUser } = useAuthProvider();
  const [splitContent, setSplitContent] = React.useState(false);
  const [fontSize, setFontSize] = React.useState(16);
  const { autoScrollContentSpeed, setAutoScrollContentSpeed } = useConfigurationState();

  if (!loggedUser) {
    return null;
  }

  const cardHeader = (
    <div className={styles.song_card_title_header}>
      <Typography component="h4" color="primary">
        {song.title}
      </Typography>
      <Typography variant="caption" display="block" gutterBottom color="textSecondary">
        {song.artist}
      </Typography>
    </div>
  );

  const changeFontSize = ({ increase }) => {
    if (increase) {
      setFontSize(fontSize + FONT_SIZE_BREAK);
    } else {
      setFontSize(fontSize - FONT_SIZE_BREAK);
    }
  }

  const scrollContentStartStop = () => {
    if (autoScrollContentSpeed) {
      autoPageScrollDownStop();
      setAutoScrollContentSpeed({ value: AUTO_SCROLL_NO_SPEED });
    } else {
      autoPageScrollDownStart();
      setAutoScrollContentSpeed({ value: AUTO_SCROLL_FIRST_SPEED });
    }
  }

  const scrollContent = ({ speedUp }) => {
    let scrollDown;
    if (speedUp) {
      if (autoScrollContentSpeed) {
        scrollDown = autoScrollContentSpeed - AUTO_SCROLL_SPEED_BREAK;
      } else {
        scrollDown = AUTO_SCROLL_FIRST_SPEED;
      }
    } else {
      scrollDown = autoScrollContentSpeed === AUTO_SCROLL_FIRST_SPEED ? AUTO_SCROLL_NO_SPEED : autoScrollContentSpeed + AUTO_SCROLL_SPEED_BREAK;
    }
    setAutoScrollContentSpeed({ value: scrollDown });
    if (scrollDown) {
      autoPageScrollDownStop();
      autoPageScrollDownStart(scrollDown);
    } else {
      autoPageScrollDownStop();
    }
  }

  const isSongOwner = Number(loggedUser.user.id) === song.ownerId;

  let editButton;
  if (isSongOwner) {
    editButton = (
      <IconButton
        id={`${song.id}_editButton`}
        href={`/song/${song.id}`}
        title="Edit Song"
        color="primary"
      >
        <EditIcon />
      </IconButton>
    );
  }

  let accordionSufix;
  if (onSelectSong) {
    accordionSufix = (
      <Checkbox
        id={`checkbox_${song.id}`}
        className={styles.song_card_checkbox}
        onChange={(e) => onSelectSong({ song, selected: e.target.checked })}
        disabled={disableSelectSong}
      />
    );
  }

  let cardContent;
  if (song.entries && song.entries.length) {
    let autoScrollContentSpeedLabel;
    let autoScrollContentSpeedActions;

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

      autoScrollContentSpeedActions = (
        <>
          <IconButton
            id={`${song.id}_scrollDownSpeedUpButton`}
            title="Auto Scroll Content"
            onClick={() => scrollContent({ speedUp: true })}
            color="primary"
            disabled={autoScrollContentSpeed === AUTO_SCROLL_SPEED_BREAK}
          >
            <AddIcon />
          </IconButton>
          <label>{autoScrollContentSpeedLabel}</label>
          <IconButton
            id={`${song.id}_scrollDownSpeedDownButton`}
            title="Auto Scroll Content"
            onClick={() => scrollContent({ speedUp: false })}
            color="primary"
            disabled={autoScrollContentSpeed === AUTO_SCROLL_FIRST_SPEED}
          >
            <RemoveIcon />
          </IconButton>
        </>
      );
    }

    const songObservation = song.observation && (
      <div className={styles.song_observation_footer}>
        <Typography variant="caption" display="block" gutterBottom>
          {song.observation}
        </Typography>
      </div>
    );

    const songFooter = (
      <>
        {songObservation}
        {!isSongOwner &&
          <Typography variant="caption" display="block" gutterBottom>
            <br />
            {`By ${song.ownerName}`}
          </Typography>
        }
      </>
    );

    const actions = (
      <div>
        {editButton}
        <IconButton
          id={`${song.id}_increaseFontSizeButton`}
          title="Increase Font Size"
          onClick={() => changeFontSize({ increase: true })}
          color="primary"
        >
          <TextIncreaseIcon />
        </IconButton>
        <IconButton
          id={`${song.id}_decreaseFontSizeButton`}
          title="Decrease Font Size"
          onClick={() => changeFontSize({ increase: false })}
          color="primary"
          disabled={fontSize === FONT_SIZE_DECREASE_LIMIT}
        >
          <TextDecreaseIcon sx={{ fontSize: 18 }} className={styles.song_card_actions_decrease_font_size_icon} />
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
          id={`${song.id}_scrollDownButton`}
          title="Auto Scroll Content"
          onClick={() => scrollContentStartStop()}
          color="primary"
        >
          <KeyboardDoubleArrowDownIcon />
        </IconButton>
        {autoScrollContentSpeedActions}
      </div>
    );

    const firstEntry = song.entries[0];
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
            <div style={{ fontSize }}>
              <HtmlParser content={firstEntry.content} className={splitContent ? styles.song_card_content_split : ''} />
              {songFooter}
            </div>
          </AccordionDetails>
        </Accordion>
      );
    } else {
      cardContent = (
        <div className={styles.song_card_multiple_accordion}>
          <div className="song_card_header">
            {cardHeader}
          </div>
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
                <div style={{ fontSize }}>
                  <HtmlParser content={entry.content} className={splitContent ? styles.song_card_content_split : ''} />
                  {songFooter}
                </div>
              </AccordionDetails>
            </Accordion>
          ))
          }
        </div>
      );
    }
  } else {
    cardContent = (
      <Accordion id={`${song.id}-0`} className="ms-accordion single-no-title-entry">
        <AccordionSummary
          id={`${song.id}-summary`}
          expandIcon={<ExpandMoreIcon />}
        >
          {cardHeader}
        </AccordionSummary>
        <AccordionDetails>
          {editButton}
        </AccordionDetails>
      </Accordion>
    )
  }

  return (
    <div className={styles.song_card_wrapper}>
      {accordionSufix}
      {cardContent}
    </div>
  );
}

export default Song;