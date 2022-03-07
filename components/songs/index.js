import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import Song from '@/components/songs/song';
import { useSongsState } from '@/lib/songs-store';
import { useSongsFilterState } from '@/lib/songsFilter-store';
import styles from '@/styles/general.module.css';
import { filterSongs } from '@/lib/utils';

const Songs = () => {
     const { songs, isLoadingSongs } = useSongsState();
     const { songsFilterValue } = useSongsFilterState();

     let songsList;
     if (isLoadingSongs) {
          const songsListSkeleton = new Array(15).fill().map((v, i) =>
               <Skeleton key={i} variant="rect" height={60} className={styles.songs_list_skeleton} />
          );
          songsList = (
               <Container className={styles.content_container}>
                    {songsListSkeleton}
               </Container>
          )
     } else {
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
     }

     return songsList;
}

export default Songs;