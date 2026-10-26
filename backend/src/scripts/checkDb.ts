import { pool } from '../config/database.js';

async function check() {
  try {
    const res = await pool.query(`
      SELECT table_name, column_name, column_default, is_nullable
      FROM information_schema.columns
      WHERE table_name IN ('pessoa', 'livro', 'emprestimo')
      ORDER BY table_name, ordinal_position;
    `);
    console.log('COLUMNS:', JSON.stringify(res.rows, null, 2));
  } catch (e) {
    console.error('ERROR:', e);
  } finally {
    await pool.end();
  }
}

check();
