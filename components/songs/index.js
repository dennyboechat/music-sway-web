import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import Song from '@/components/songs/song';
import { useSongsState } from '@/lib/songs-store';
import { useSongsFilterState } from '@/lib/songsFilter-store';
import styles from '@/styles/general.module.css';
import { forEach, orderBy } from 'lodash';
import { getParsedCharacterText } from '@/lib/utils';

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
          if (songs.length) {
               if (songsFilterValue && songsFilterValue.length) {
                    forEach(songs, song => {
                         if (getParsedCharacterText({ text: song.title }).startsWith(songsFilterValue.toLowerCase())) {
                              song.filterOrder = 1;
                              sortedSongs.push(song);
                         } else if (getParsedCharacterText({ text: song.title }).includes(songsFilterValue.toLowerCase())) {
                              song.filterOrder = 2;
                              sortedSongs.push(song);
                         } else if (getParsedCharacterText({ text: song.artist }).includes(songsFilterValue.toLowerCase())) {
                              song.filterOrder = 3;
                              sortedSongs.push(song);
                         } else if (getParsedCharacterText({ text: song.category }).includes(songsFilterValue.toLowerCase())) {
                              song.filterOrder = 4;
                              sortedSongs.push(song);
                         } else if (getParsedCharacterText({ text: song.observation }).includes(songsFilterValue.toLowerCase())) {
                              song.filterOrder = 5;
                              sortedSongs.push(song);
                         } else if (song.entries && song.entries.some(entry => (getParsedCharacterText({ text: entry.title }).includes(songsFilterValue.toLowerCase())))) {
                              song.filterOrder = 6;
                              sortedSongs.push(song);
                         } else if (song.entries && song.entries.some(entry => (getParsedCharacterText({ text: entry.content }).includes(songsFilterValue.toLowerCase())))) {
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

     return songsList;
}

export default Songs;