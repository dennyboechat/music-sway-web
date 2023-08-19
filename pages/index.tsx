import React from 'react';
import Header from '@/components/header';
import Songs from '@/components/songs';
import Playlists from '@/components/playlists';
import PlaylistFilter from '@/components/playlists/filter';
import { SearchInput } from '@/components/songs/filter';
import FloatingButton from '@/components/floating-button';
import AddIcon from '@mui/icons-material/Add';
import HeaderPanel from '@/components/header/header-panel';
import HomePage from '@/components/home-page';
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
import styles from '@/styles/general.module.css';
import 'swiper/css';
import "swiper/css/navigation";
import { Navigation } from "swiper";
import { scrollToPageTop } from '@/lib/utils';
import { autoPageScrollDownStop } from '@/lib/utils';
import { useConfigurationState } from '@/lib/configuration-store';
import { useMediaQuery, Theme } from '@mui/material';
import { PageNavigation } from '@/lib/page-navigation';
import { useAuthProvider } from '@/lib/auth-provider';

const Home = () => {
  const { loggedUser, status } = useAuthProvider();
  const { pageNavigation, setPageNavigation, setAutoScrollContentSpeed } = useConfigurationState();
  const [showSongs, setShowSongs] = React.useState(true);
  const swiperRef = React.useRef<SwiperRef>(null);

  React.useEffect(() => {
    const showSongs = !pageNavigation || pageNavigation === PageNavigation.SONGS ? true : false;
    setShowSongs(showSongs);
    if (swiperRef?.current?.swiper) {
      const swiperIndex = showSongs ? 0 : 1;
      swiperRef.current.swiper.slideTo(swiperIndex);
    }
  }, [pageNavigation]);

  const isBiggerResolution = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

  if (status !== 'authenticated' || !loggedUser) {
    return <HomePage />;
  }

  const onSwipeReachBeginning = () => () => {
    autoPageScrollDownStop();
    setAutoScrollContentSpeed(0);
    setShowSongs(true);
    setPageNavigation(PageNavigation.SONGS);
    scrollToPageTop();
  }

  const onSwipeReachEnd = () => () => {
    autoPageScrollDownStop();
    setAutoScrollContentSpeed(0);
    setShowSongs(false);
    setPageNavigation(PageNavigation.PLAYLISTS);
    scrollToPageTop();
  }

  let filter;
  let createRecordButton;
  if (showSongs) {
    filter = (
      <SearchInput />
    );
    createRecordButton = (
      <div className={styles.fab_buttons}>
        <FloatingButton
          id="addSongButton"
          ariaLabel="addSong"
          href="song/new"
          title="Add Song"
          size="large"
          icon={<AddIcon />}
          label=""
          onClick={undefined}
        />
      </div>
    );
  } else {
    filter = (
      <PlaylistFilter />
    );
    createRecordButton = (
      <div className={styles.fab_buttons}>
        <FloatingButton
          id="addPlaylistButton"
          ariaLabel="addPlaylist"
          href="playlist/new"
          title="Add Playlist"
          size="large"
          icon={<AddIcon />}
          label=""
          onClick={undefined}
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
