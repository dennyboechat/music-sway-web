import mysql from 'serverless-mysql';
import { Query } from 'types';

export const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
  },
});

export const query: Query = async (q, values = []) => {
  try {
    const results = await db.query(q, values);
    await db.end();
    return results;
  } catch (e) {
    throw Error(e.message);
  }
};