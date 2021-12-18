import React from "react";
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import themeDark from '@/styles/themeDark';
import NoSleep from 'nosleep.js';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }) => {

  React.useEffect(() => {
    const noSleep = new NoSleep();
    noSleep.enable();
  }, []);

  return (
    <ThemeProvider theme={themeDark}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp