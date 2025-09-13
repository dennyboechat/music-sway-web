import { createPool } from '@vercel/postgres';

// Create a PostgreSQL connection pool using Vercel environment variables
const pool = createPool();

export const query = async (q: string, values: any[] = []) => {
  const client = await pool.connect();
  try {
    const result = await client.query(q, values);
    return result.rows;
  } finally {
    client.release();
  }
};