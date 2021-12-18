const path = require('path');
const envPath = path.resolve(process.cwd(), '.env.local');

console.log({ envPath });

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

async function query(q) {
  try {
    const results = await db.query(q);
    await db.end();
    return results;
  } catch (e) {
    throw Error(e.message)
  }
}

// Create tables if don't exist
async function migrate() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS song (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        artist VARCHAR(255),
        category VARCHAR(255),
        observation VARCHAR(2550),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at 
          TIMESTAMP 
          NOT NULL 
          DEFAULT CURRENT_TIMESTAMP 
          ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    await query(`
      CREATE TABLE IF NOT EXISTS song_entry (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        content TEXT,
        song_id INT NOT NULL,
        CONSTRAINT fk_song_entry_song
          FOREIGN KEY (song_id) REFERENCES song (id)
          ON DELETE CASCADE
          ON UPDATE RESTRICT      
      )
    `);
    console.log('Migration ran successfully.');
  } catch (e) {
    console.error('Could not run migration.', e);
    process.exit(1);
  }
}

migrate().then(() => process.exit());