import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Song from '@/components/songs/song';
import MsLogo from '@/components/ms-logo';
import Filter from '@/components/songs/filter';
import { useSongsState } from '@/lib/songs-store';
import { useSongsFilterState } from '@/lib/songsFilter-store';
import styles from '@/styles/general.module.css';
import { forEach, orderBy } from 'lodash';

const Songs = () => {
     const { songs, isLoadingSongs } = useSongsState();
     const { songsFilterValue } = useSongsFilterState();

     let songsList;
     if (isLoadingSongs) {
          const songPanelHeight = 110;
          const songsListSkeleton = new Array(8).fill().map((v, i) =>
               <Skeleton key={i} variant="rect" height={songPanelHeight} className={styles.songs_list_skeleton} />
          );
          songsList = (
               <Container className={styles.content_container}>
                    {songsListSkeleton}
               </Container>
          )
     } else {
          let sortedSongs = [];
          if (songs.length > 0) {
               if (songsFilterValue && songsFilterValue.length > 0) {
                    forEach(songs, song => {
                         if (song.title.toLowerCase().startsWith(songsFilterValue.toLowerCase())) {
                              song.filterOrder = 1;
                              sortedSongs.push(song);
                         } else if (song.title.toLowerCase().includes(songsFilterValue.toLowerCase())) {
                              song.filterOrder = 2;
                              sortedSongs.push(song);
                         } else if (song.artist && song.artist.toLowerCase().includes(songsFilterValue.toLowerCase())) {
                              song.filterOrder = 3;
                              sortedSongs.push(song);
                         } else if (song.category && song.category.toLowerCase().includes(songsFilterValue.toLowerCase())) {
                              song.filterOrder = 4;
                              sortedSongs.push(song);
                         } else if (song.observation && song.observation.toLowerCase().includes(songsFilterValue.toLowerCase())) {
                              song.filterOrder = 5;
                              sortedSongs.push(song);
                         } else if (song.entries && song.entries.some(entry => (entry.title && entry.title.toLowerCase().includes(songsFilterValue.toLowerCase())))) {
                              song.filterOrder = 6;
                              sortedSongs.push(song);
                         } else if (song.entries && song.entries.some(entry => (entry.content && entry.content.toLowerCase().includes(songsFilterValue.toLowerCase())))) {
                              song.filterOrder = 7;
                              sortedSongs.push(song);
                         }
                    });
                    sortedSongs = orderBy(sortedSongs, ['filterOrder']);
               } else {
                    sortedSongs = songs;
               }
          }
          songsList = (
               <Container>
                    {sortedSongs.map(song => (
                         <div key={song.id}>
                              <Song song={song} />
                         </div>
                    ))}
               </Container>
          );
     }

     return (
          <div>
               <div className={styles.songs_header}>
                    <span className={styles.header_logo}>
                         <MsLogo />
                    </span>
                    <div className={styles.header_title} />
                    <Filter />
               </div>
               {songsList}
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
          </div>
     );
}

export default Songs;