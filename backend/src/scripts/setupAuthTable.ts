import bcryptjs from 'bcryptjs';
import { pool } from '../config/database.js';

async function setup() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS usuario (
        id_usuario SERIAL PRIMARY KEY,
        id_pessoa INT REFERENCES pessoa(id_pessoa) ON DELETE SET NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        ativo BOOLEAN DEFAULT TRUE,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const defaultPassword = await bcryptjs.hash('123456', 10);

    await client.query(
      `
      INSERT INTO usuario (id_pessoa, email, senha)
      VALUES 
        (3, 'mariana.santos@escola.sp.gov.br', $1),
        (3, 'shayare.rocha.ferreira@gmail.com', $1),
        (3, 'admin@empresto.com', $1)
      ON CONFLICT (email) DO NOTHING;
    `,
      [defaultPassword]
    );

    const res = await client.query(`
      SELECT u.id_usuario, u.email, u.criado_em, p.nome, p.tipo_pessoa
      FROM usuario u
      LEFT JOIN pessoa p ON u.id_pessoa = p.id_pessoa;
    `);

    console.log('TABELA_USUARIO_CRIADA_COM_SUCESSO:');
    console.log(res.rows);
  } catch (error) {
    console.error('ERRO_SETUP_USUARIO:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

setup();
