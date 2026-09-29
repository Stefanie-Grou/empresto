import { pool } from '../config/database.js';

async function updateSchema() {
  const client = await pool.connect();
  try {
    await client.query(`
      ALTER TABLE usuario 
      ADD COLUMN IF NOT EXISTS nome VARCHAR(255),
      ADD COLUMN IF NOT EXISTS nome_usuario VARCHAR(100) UNIQUE;
    `);

    await client.query(`
      UPDATE usuario 
      SET nome = 'Mariana Santos', nome_usuario = 'mariana.santos' 
      WHERE email = 'mariana.santos@escola.sp.gov.br';
    `);

    await client.query(`
      UPDATE usuario 
      SET nome = 'Shayare Ferreira', nome_usuario = 'shayare' 
      WHERE email = 'shayare.rocha.ferreira@gmail.com';
    `);

    await client.query(`
      UPDATE usuario 
      SET nome = 'Administrador', nome_usuario = 'admin' 
      WHERE email = 'admin@empresto.com';
    `);

    const res = await client.query(`
      SELECT id_usuario, nome, nome_usuario, email, criado_em 
      FROM usuario 
      ORDER BY id_usuario;
    `);

    console.log('COLUNAS_ATUALIZADAS_COM_SUCESSO:');
    console.log(res.rows);
  } catch (error) {
    console.error('ERRO_ATUALIZACAO_SCHEMA:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

updateSchema();
