import React from "react";
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import themeDark from '@/styles/themeDark';
import { SongsStateProvider } from '@/lib/songs-store';
import { SongsFilterStateProvider } from '@/lib/songsFilter-store';
import { PlaylistsStateProvider } from '@/lib/playlists-store';
import { ConfigurationStateProvider } from '@/lib/configuration-store';
import { MessageStateProvider } from '@/lib/message-store';
import AlertMessage from '@/components/alert';
import NoSleep from 'nosleep.js';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }) => {

  React.useEffect(() => {
    const noSleep = new NoSleep();
    noSleep.enable();
  }, []);

  return (
    <ThemeProvider theme={themeDark}>
      <SongsStateProvider>
        <SongsFilterStateProvider>
          <PlaylistsStateProvider>
            <ConfigurationStateProvider>
              <MessageStateProvider>
                <CssBaseline />
                <Component {...pageProps} />
                <AlertMessage />
              </MessageStateProvider>
            </ConfigurationStateProvider>
          </PlaylistsStateProvider>
        </SongsFilterStateProvider>
      </SongsStateProvider>
    </ThemeProvider>
  );
}

export default MyApp;