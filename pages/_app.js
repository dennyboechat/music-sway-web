import React from "react";
import { SessionProvider } from 'next-auth/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import themeDark from '@/styles/themeDark';
import { SongsStateProvider } from '@/lib/songs-store';
import { SongsFilterStateProvider } from '@/lib/songsFilter-store';
import { PlaylistsStateProvider } from '@/lib/playlists-store';
import { ConfigurationStateProvider } from '@/lib/configuration-store';
import { MessageStateProvider } from '@/lib/message-store';
import { BandsStateProvider } from "@/lib/bands-store";
import { UserInvitationBandsStateProvider } from "@/lib/user-invitation-bands-store";
import { BandsSongsStateProvider } from "@/lib/bands-songs-store";
import { AuthProvider } from "@/lib/auth-provider";
import AlertMessage from '@/components/alert';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps: { session, ...pageProps } }) => {

  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={themeDark}>
        <AuthProvider>
          <SongsStateProvider>
            <SongsFilterStateProvider>
              <PlaylistsStateProvider>
                <ConfigurationStateProvider>
                  <MessageStateProvider>
                    <BandsStateProvider>
                      <UserInvitationBandsStateProvider>
                        <BandsSongsStateProvider>
                          <CssBaseline />
                          <Component {...pageProps} />
                          <AlertMessage />
                        </BandsSongsStateProvider>
                      </UserInvitationBandsStateProvider>
                    </BandsStateProvider>
                  </MessageStateProvider>
                </ConfigurationStateProvider>
              </PlaylistsStateProvider>
            </SongsFilterStateProvider>
          </SongsStateProvider>
        </AuthProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}

export default MyApp;