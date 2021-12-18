import Head from 'next/head'
import Songs from '@/components/songs'
import { SongsStateProvider } from '@/lib/songs-store';
import { SongsFilterStateProvider } from '@/lib/songsFilter-store';

export default function Home() {
  return (
    <>
      <Head>
        <title>Music Sway</title>
        <meta name="description" content="Manage music you play" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SongsStateProvider>
        <SongsFilterStateProvider>
          <Songs />
        </SongsFilterStateProvider>
      </SongsStateProvider>
    </>
  )
}
