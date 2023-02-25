import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Song from '@/components/songs/song';
import AddIcon from '@mui/icons-material/Add';
import { useSongsState } from '@/lib/songs-store';
import { useSongsFilterState } from '@/lib/songsFilter-store';
import styles from '@/styles/general.module.css';
import { filterSongs } from '@/lib/utils';

const Songs = () => {
     const { songs, isLoadingSongs } = useSongsState();
     const { songsFilterValue, setSongsFilterValue } = useSongsFilterState();

     React.useEffect(() => {
          setSongsFilterValue('');
     }, [setSongsFilterValue]);

     let songsList;
     if (isLoadingSongs) {
          const songsListSkeleton = new Array(15).fill().map((v, i) =>
               <Skeleton key={i} variant="rectangular" height={60} className={styles.songs_list_skeleton} />
          );
          songsList = (
               <Container className={styles.content_container}>
                    {songsListSkeleton}
               </Container>
          )
     } else {
          if (songs && songs.length) {
               const sortedSongs = filterSongs({ songs, songsFilterValue });
               songsList = (
                    <Container>
                         {sortedSongs.map(song => (
                              <div key={song.id}>
                                   <Song song={song} />
                              </div>
                         ))}
                    </Container>
               );
          } else {
               songsList = (
                    <Container>
                         <Button
                              id="addFirstSongButton"
                              aria-label="addFirstSong"
                              href="song/new"
                              variant="outlined"
                              startIcon={<AddIcon />}
                         >
                              {'Add your first Song'}
                         </Button>
                    </Container>
               );
          }
     }

     return songsList;
}

export default Songs;