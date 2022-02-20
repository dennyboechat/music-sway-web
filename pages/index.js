import React from 'react';
import Header from '@/components/header';
import Songs from '@/components/songs';
import Playlists from '@/components/playlists';
import MsLogo from '@/components/ms-logo';
import Filter from '@/components/songs/filter';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from "swiper";
import styles from '@/styles/general.module.css';
import 'swiper/css';
import "swiper/css/pagination";
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
        {showSongsFilter && <Filter />}
      </div>
      <Swiper
        modules={[Pagination]}
        grabCursor={true}
        onReachBeginning={onSwipeReachBeginning()}
        onReachEnd={onSwipeReachEnd()}
      >
        <SwiperSlide id="songsSwiper">
          <Songs />
        </SwiperSlide>
        <SwiperSlide id="playlistsSwiper">
          <Playlists />
        </SwiperSlide>
      </Swiper>
    </>
  )
}

export default Home;
