import React from 'react';
import Header from '@/components/header';
import Songs from '@/components/songs';
import Playlists from '@/components/playlists';
import Filter from '@/components/songs/filter';
import FloatingButton from '@/components/floating-button';
import AddIcon from '@mui/icons-material/Add';
import HeaderPanel from '@/components/header/header-panel';
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
        <FloatingButton
          id="addSongButton"
          aria-label="addSong"
          href="song/new"
          title="Add Song"
          variant={null}
          icon={<AddIcon />}
        />
      </div>
    );
  } else {
    createRecordButton = (
      <div className={styles.fab_buttons}>
        <FloatingButton
          id="addPlaylistButton"
          aria-label="addPlaylist"
          href="playlist/new"
          title="Add Playlist"
          variant={null}
          icon={<AddIcon />}
        />
      </div>
    );
  }

  return (
    <>
      <Header />
      <HeaderPanel>
        {filter}
      </HeaderPanel>
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
