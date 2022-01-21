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

// Create tables if don't exist
const migrate = async () => {
  try {

    await query(`
      CREATE TABLE IF NOT EXISTS user (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS song_restriction (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS song (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        artist VARCHAR(255),
        category VARCHAR(255),
        observation VARCHAR(2550),
        owner_id INT NOT NULL,
        restriction_id INT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_song_owner_user FOREIGN KEY (owner_id) REFERENCES user (id) ON DELETE CASCADE ON UPDATE RESTRICT,
        CONSTRAINT fk_song_restriction_song_restriction FOREIGN KEY (restriction_id) REFERENCES song_restriction (id) ON DELETE CASCADE ON UPDATE RESTRICT
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS song_entry (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        content TEXT,
        song_id INT NOT NULL,
        CONSTRAINT fk_song_entry_song FOREIGN KEY (song_id) REFERENCES song (id) ON DELETE CASCADE ON UPDATE RESTRICT      
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS playlist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        observation VARCHAR(2550),
        owner_id INT NOT NULL,
        restriction_id INT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_playlist_owner_user FOREIGN KEY (owner_id) REFERENCES user (id) ON DELETE CASCADE ON UPDATE RESTRICT,
        CONSTRAINT fk_playlist_restriction_playlist_restriction FOREIGN KEY (restriction_id) REFERENCES song_restriction (id) ON DELETE CASCADE ON UPDATE RESTRICT
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS playlist_entry (
        id INT AUTO_INCREMENT PRIMARY KEY,
        playlist_id INT NOT NULL,
        song_id INT NOT NULL,
        order_index INT NOT NULL,
        CONSTRAINT fk_playlist_entry_playlist FOREIGN KEY (playlist_id) REFERENCES playlist (id) ON DELETE CASCADE ON UPDATE RESTRICT      
        CONSTRAINT fk_playlist_entry_song FOREIGN KEY (song_id) REFERENCES song (id) ON DELETE CASCADE ON UPDATE RESTRICT      
      )
    `);

    console.log('Migration ran successfully.');
  } catch (e) {
    console.error('Could not run migration.', e);
    process.exit(1);
  }
}

migrate().then(() => process.exit());