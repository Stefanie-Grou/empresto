import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

export const pool = new pg.Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 30000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

pool.on('error', (err) => {
  console.error('Erro no pool PostgreSQL:', err.message);
});

export async function testConnection(): Promise<boolean> {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT NOW() as agora, current_database() as banco');
    return !!res.rows[0];
  } finally {
    client.release();
  }
}
