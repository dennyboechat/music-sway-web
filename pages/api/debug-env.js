// Debug endpoint to check environment variables in production
// Remove this file after debugging

export default function handler(req, res) {
  if (process.env.NODE_ENV !== 'production') {
    return res.status(404).json({ message: 'Not found' });
  }
  
  // Only accessible in production for debugging
  const envCheck = {
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    hasSpotifyId: !!process.env.SPOTIFY_CLIENT_ID,
    hasSpotifySecret: !!process.env.SPOTIFY_CLIENT_SECRET,
    hasDbUrl: !!process.env.POSTGRES_URL,
    nodeEnv: process.env.NODE_ENV,
  };
  
  res.status(200).json(envCheck);
}
