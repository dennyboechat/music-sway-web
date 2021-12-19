import React from "react";
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import themeDark from '@/styles/themeDark';
import { SongsStateProvider } from '@/lib/songs-store';
import { SongsFilterStateProvider } from '@/lib/songsFilter-store';
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
          <CssBaseline />
          <Component {...pageProps} />
        </SongsFilterStateProvider>
      </SongsStateProvider>
    </ThemeProvider>
  );
}

export default MyApp;