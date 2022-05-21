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
import "swiper/css/navigation";
import { Navigation } from "swiper";
import { scrollToPageTop } from '@/lib/utils';
import { autoPageScrollDownStop } from '@/lib/utils';
import { useConfigurationState } from '@/lib/configuration-store';
import useMediaQuery from '@mui/material/useMediaQuery';
import PageNavigation from '@/lib/page-navigation';

const Home = () => {
  const { navigationPage, setAutoScrollContentSpeed } = useConfigurationState();
  const [showSongs, setShowSongs] = React.useState(true);

  React.useEffect(() => {
    setShowSongs(!navigationPage || navigationPage === PageNavigation.SONGS ? true : false);
  }, [navigationPage]);

  const isBiggerResolution = useMediaQuery((theme) => theme.breakpoints.up('1300'));

  const onSwipeReachBeginning = () => () => {
    autoPageScrollDownStop();
    setAutoScrollContentSpeed({ value: 0 });
    setShowSongs(true);
    scrollToPageTop();
  }

  const onSwipeReachEnd = () => () => {
    autoPageScrollDownStop();
    setAutoScrollContentSpeed({ value: 0 });
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
        navigation={isBiggerResolution}
        modules={[Navigation]}
        initialSlide={navigationPage === PageNavigation.PLAYLISTS ? 1 : 0}
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
