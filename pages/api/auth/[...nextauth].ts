import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';

export default NextAuth({
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID || '',
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET || '',
        }),
    ],
    pages: {
        signIn: '/auth/new-user',
        error: '/auth/error',
    },
    secret: process.env.NEXTAUTH_SECRET,
    // Add session configuration for production
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    // Add JWT configuration
    jwt: {
        maxAge: 60 * 60 * 24 * 30, // 30 days
    },
    // Add debug logging for production
    debug: process.env.NODE_ENV === 'development',
    // Add callbacks for better session handling
    callbacks: {
        async session({ session, token }) {
            // Ensure session data is properly formatted
            return session;
        },
        async jwt({ token, account, profile }) {
            // Persist the OAuth account data
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
    },
});