import bcryptjs from 'bcryptjs';
import { pool } from '../config/database.js';

async function setupAdminOnly() {
  const client = await pool.connect();
  try {
    await client.query(`
      ALTER TABLE usuario 
      ADD COLUMN IF NOT EXISTS perfil VARCHAR(50) DEFAULT 'Admin';
    `);

    await client.query(`
      DELETE FROM usuario 
      WHERE nome_usuario != 'admin';
    `);

    const adminHash = await bcryptjs.hash('Admin@123', 10);

    const checkAdmin = await client.query(`SELECT id_usuario FROM usuario WHERE nome_usuario = 'admin';`);

    if (checkAdmin.rows.length === 0) {
      await client.query(
        `
        INSERT INTO usuario (nome, nome_usuario, email, senha, perfil, ativo)
        VALUES ('Administrador', 'admin', 'admin@empresto.com', $1, 'Admin', TRUE);
      `,
        [adminHash]
      );
    } else {
      await client.query(
        `
        UPDATE usuario 
        SET nome = 'Administrador',
            nome_usuario = 'admin',
            email = 'admin@empresto.com',
            senha = $1,
            perfil = 'Admin',
            ativo = TRUE
        WHERE nome_usuario = 'admin';
      `,
        [adminHash]
      );
    }

    const res = await client.query(`
      SELECT id_usuario, nome, nome_usuario, email, perfil, ativo, criado_em 
      FROM usuario;
    `);

    console.log('USUARIOS_FINAIS_NO_BANCO:');
    console.log(res.rows);
  } catch (error) {
    console.error('ERRO_SETUP_ADMIN:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

setupAdminOnly();
