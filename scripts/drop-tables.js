const path = require('path');
const envPath = path.resolve(process.cwd(), '.env.local');

require('dotenv').config({ path: envPath });

const mysql = require('serverless-mysql');

const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
  },
});

const query = async (q) => {
  try {
    const results = await db.query(q);
    await db.end();
    return results;
  } catch (e) {
    throw Error(e.message)
  }
}

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
  } catch (e) {
    console.error('Could not run drop tables script.', e);
    process.exit(1);
  }
}

dropTables().then(() => process.exit());