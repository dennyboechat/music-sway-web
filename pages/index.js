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

const Home = () => {
  const [showSongsFilter, setShowSongsFilter] = React.useState(true);

  const onSwipeReachBeginning = () => () => {
    setShowSongsFilter(true);
    scrollToPageTop();
  }

  const onSwipeReachEnd = () => () => {
    setShowSongsFilter(false);
    scrollToPageTop();
  }

  return (
    <>
      <Header />
      <div className={styles.general_header}>
        <span className={styles.header_logo}>
          <MsLogo />
        </span>
        <div className={styles.header_title} />
        {showSongsFilter &&
          <Filter />
        }
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
      {showSongsFilter &&
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
      }
    </>
  )
}

export default Home;
