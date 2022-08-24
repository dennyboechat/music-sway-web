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
import { useAuthProvider } from '@/lib/auth-provider';

const Home = () => {
  const { loggedUser } = useAuthProvider();
  const { pageNavigation, setPageNavigation, setAutoScrollContentSpeed } = useConfigurationState();
  const [showSongs, setShowSongs] = React.useState(true);
  const swiperRef = React.useRef();

  React.useEffect(() => {
    const showSongs = !pageNavigation || pageNavigation === PageNavigation.SONGS ? true : false;
    setShowSongs(showSongs);
    if (swiperRef && swiperRef.current && swiperRef.current.swiper) {
      const swiperIndex = showSongs ? 0 : 1;
      swiperRef.current.swiper.slideTo(swiperIndex);
    }
  }, [pageNavigation]);

  const isBiggerResolution = useMediaQuery((theme) => theme.breakpoints.up('1300'));

  if (!loggedUser) {
    return (
      <>
        <Header />
        <HeaderPanel />
      </>
    );
  }

  const onSwipeReachBeginning = () => () => {
    autoPageScrollDownStop();
    setAutoScrollContentSpeed({ value: 0 });
    setShowSongs(true);
    setPageNavigation({ value: PageNavigation.SONGS });
    scrollToPageTop();
  }

  const onSwipeReachEnd = () => () => {
    autoPageScrollDownStop();
    setAutoScrollContentSpeed({ value: 0 });
    setShowSongs(false);
    setPageNavigation({ value: PageNavigation.PLAYLISTS });
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
          size="large"
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
          size="large"
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
        ref={swiperRef}
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
