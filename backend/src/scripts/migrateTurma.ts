import { pool } from '../config/database.js';

async function migrate() {
  try {
    await pool.query(`
      ALTER TABLE pessoa 
      ADD COLUMN IF NOT EXISTS turma VARCHAR(50);
    `);
    console.log('MIGRATION_OK: Coluna turma adicionada/verificada na tabela pessoa.');
  } catch (error) {
    console.error('MIGRATION_ERROR:', error);
  } finally {
    await pool.end();
  }
}

migrate();
