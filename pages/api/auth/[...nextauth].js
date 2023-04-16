import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';

export default NextAuth({
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        }),
    ],
    pages: {
        signIn: '/auth/new-user',
        error: '/auth/error',
    },
    secret: process.env.NEXTAUTH_SECRET,
});