import React from 'react';
import Header from '@/components/header';
import Songs from '@/components/songs';
import Playlists from '@/components/playlists';
import MsLogo from '@/components/ms-logo';
import Filter from '@/components/songs/filter';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { Swiper, SwiperSlide } from 'swiper/react';
import styles from '@/styles/general.module.css';
import 'swiper/css';
import { scrollToPageTop } from '@/lib/utils';
import { autoPageScrollDownStop } from '@/lib/utils';
import { useConfigurationState } from '@/lib/configuration-store';

const Home = () => {
  const { setAutoScrollContentSpeed } = useConfigurationState();
  const [showSongs, setShowSongs] = React.useState(true);

  const onSwipeReachBeginning = () => () => {
    autoPageScrollDownStop();
    setAutoScrollContentSpeed(0);
    setShowSongs(true);
    scrollToPageTop();
  }

  const onSwipeReachEnd = () => () => {
    autoPageScrollDownStop();
    setAutoScrollContentSpeed(0);
    setShowSongs(false);
    scrollToPageTop();
  }

  let filter;
  let createRecordButton;
  if (showSongs) {
    filter = (
      <Filter />
    );
    createRecordButton = (
      <div className={styles.fab_buttons}>
        <Fab
          id="addSongButton"
          color="primary"
          aria-label="add"
          href="song/new"
          title="Add Song"
        >
          <AddIcon />
        </Fab>
      </div>
    );
  } else {
    createRecordButton = (
      <div className={styles.fab_buttons}>
        <Fab
          id="addPlaylistButton"
          color="primary"
          aria-label="add"
          href="playlist/new"
          title="Add Playlist"
        >
          <AddIcon />
        </Fab>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className={styles.general_header}>
        <span className={styles.header_logo}>
          <MsLogo />
        </span>
        <div className={styles.header_title} />
        {filter}
      </div>
      <Swiper
        grabCursor={true}
        onReachBeginning={onSwipeReachBeginning()}
        onReachEnd={onSwipeReachEnd()}
      >
        <SwiperSlide id="songsSwiper" className={styles.swiper_slide}>
          <Songs />
        </SwiperSlide>
        <SwiperSlide id="playlistsSwiper" className={styles.swiper_slide}>
          <Playlists />
        </SwiperSlide>
      </Swiper>
      {createRecordButton}
    </>
  )
}

export default Home;
