const dropTables = async () => {
  try {
    await query(`
      DROP TABLE IF EXISTS 
        playlist_entry, 
        playlist,
        song_entry,
        song,
        song_restriction,
        user_band,
        band,
        band_user_status,
        user
    `);
    console.log('Drop tables ran successfully.');
  } catch (error: any) {
    console.error('Could not run drop tables script.', error);
    process.exit(1);
  }
}

dropTables().then(() => process.exit());