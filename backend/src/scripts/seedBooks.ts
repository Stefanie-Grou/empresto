import { pool } from '../config/database.js';

const booksToSeed = [
  { titulo: 'O Auto da Compadecida', autor: 'Ariano Suassuna', genero: 'Literatura Brasileira', total: 5, disp: 4 },
  { titulo: 'Turma da Mônica Jovem', autor: 'Maurício de Sousa', genero: 'Quadrinhos', total: 6, disp: 5 },
  { titulo: 'A Hipótese do Amor', autor: 'Ali Hazelwood', genero: 'Romance', total: 4, disp: 3 },
  { titulo: 'A Morte de Ivan Ilitch', autor: 'Liev Tolstói', genero: 'Clássico', total: 3, disp: 2 },
  { titulo: 'Coraline', autor: 'Neil Gaiman', genero: 'Fantasia', total: 5, disp: 4 },
  { titulo: 'Biologia de Campbell', autor: 'Andrew Reece', genero: 'Didático', total: 2, disp: 1 },
  { titulo: 'Rita Lee - Uma Autobiografia', autor: 'Rita Lee', genero: 'Biografia', total: 3, disp: 3 },
];

async function seed() {
  const client = await pool.connect();
  try {
    for (const b of booksToSeed) {
      const exists = await client.query('SELECT id_livro FROM livro WHERE LOWER(titulo) = LOWER($1)', [b.titulo]);
      if (exists.rows.length === 0) {
        await client.query(
          'INSERT INTO livro (titulo, autor, genero, quantidade_exemplares, quantidade_disponivel) VALUES ($1, $2, $3, $4, $5)',
          [b.titulo, b.autor, b.genero, b.total, b.disp]
        );
        console.log(`Livro inserido: ${b.titulo}`);
      } else {
        console.log(`Livro já existe: ${b.titulo}`);
      }
    }
  } catch (err) {
    console.error('Erro ao semear livros:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
