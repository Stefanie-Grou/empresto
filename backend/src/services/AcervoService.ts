import { pool } from '../config/database.js';
import { formatTitleCase } from '../utils/textUtils.js';

export interface NovoItemDTO {
  titulo?: string;
  bookTitle?: string;
  tipo?: string;
  genero?: string;
  itemType?: string;
  autor?: string;
  bookAuthor?: string;
  quantidadeTotal?: number;
  quantity?: number;
}

export interface FilaEsperaDTO {
  nomeAluno: string;
  serie?: string;
}

export class AcervoService {
  public async listar(termo?: string) {
    let query = 'SELECT id_livro, titulo, autor, genero, quantidade_exemplares, quantidade_disponivel FROM livro';
    const params: any[] = [];

    if (termo && termo.trim()) {
      query += ' WHERE LOWER(titulo) LIKE $1 OR LOWER(autor) LIKE $1 OR LOWER(COALESCE(genero, \'\')) LIKE $1 OR CAST(id_livro AS TEXT) LIKE $1';
      params.push(`%${termo.toLowerCase().trim()}%`);
    }

    query += ' ORDER BY id_livro ASC';

    const { rows } = await pool.query(query, params);

    return rows.map((row) => ({
      id: row.id_livro,
      id_livro: row.id_livro,
      titulo: row.titulo,
      bookTitle: row.titulo,
      autor: row.autor,
      bookAuthor: row.autor,
      tipo: row.genero || 'Livro',
      genero: row.genero || 'Livro',
      itemType: row.genero || 'Livro',
      quantidadeTotal: Number(row.quantidade_exemplares),
      quantity: Number(row.quantidade_exemplares),
      quantidadeDisponivel: Number(row.quantidade_disponivel),
      available: Number(row.quantidade_disponivel),
    }));
  }

  public async buscarPorId(id: number) {
    const { rows } = await pool.query(
      'SELECT id_livro, titulo, autor, genero, quantidade_exemplares, quantidade_disponivel FROM livro WHERE id_livro = $1',
      [id]
    );

    if (rows.length === 0) {
      const error: any = new Error('Item do acervo não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const row = rows[0];
    return {
      id: row.id_livro,
      id_livro: row.id_livro,
      titulo: row.titulo,
      bookTitle: row.titulo,
      autor: row.autor,
      bookAuthor: row.autor,
      tipo: row.genero || 'Livro',
      genero: row.genero || 'Livro',
      itemType: row.genero || 'Livro',
      quantidadeTotal: Number(row.quantidade_exemplares),
      quantity: Number(row.quantidade_exemplares),
      quantidadeDisponivel: Number(row.quantidade_disponivel),
      available: Number(row.quantidade_disponivel),
    };
  }

  public async cadastrar(dados: NovoItemDTO) {
    const titulo = formatTitleCase((dados.titulo || dados.bookTitle || '').trim());
    const autor = formatTitleCase((dados.autor || dados.bookAuthor || '').trim());
    const tipo = (dados.tipo || dados.genero || dados.itemType || 'Livro').trim();
    const quantidadeRaw = dados.quantidadeTotal !== undefined ? dados.quantidadeTotal : dados.quantity;
    const quantidade = Number(quantidadeRaw);

    if (!titulo) {
      const error: any = new Error('O título do item é obrigatório.');
      error.statusCode = 400;
      throw error;
    }

    if (!autor) {
      const error: any = new Error('O autor do item é obrigatório.');
      error.statusCode = 400;
      throw error;
    }

    if (isNaN(quantidade) || quantidade < 1) {
      const error: any = new Error('A quantidade de exemplares deve ser um número maior ou igual a 1.');
      error.statusCode = 400;
      throw error;
    }

    const { rows } = await pool.query(
      'INSERT INTO livro (titulo, autor, genero, quantidade_exemplares, quantidade_disponivel) VALUES ($1, $2, $3, $4, $5) RETURNING id_livro, titulo, autor, genero, quantidade_exemplares, quantidade_disponivel',
      [titulo, autor, tipo, quantidade, quantidade]
    );

    const row = rows[0];
    return {
      id: row.id_livro,
      id_livro: row.id_livro,
      titulo: row.titulo,
      bookTitle: row.titulo,
      autor: row.autor,
      bookAuthor: row.autor,
      tipo: row.genero || 'Livro',
      genero: row.genero || 'Livro',
      itemType: row.genero || 'Livro',
      quantidadeTotal: Number(row.quantidade_exemplares),
      quantity: Number(row.quantidade_exemplares),
      quantidadeDisponivel: Number(row.quantidade_disponivel),
      available: Number(row.quantidade_disponivel),
      mensagem: 'Item cadastrado com sucesso!',
    };
  }

  public async atualizar(id: number, dados: NovoItemDTO) {
    if (isNaN(id) || id <= 0) {
      const error: any = new Error('ID do item inválido.');
      error.statusCode = 400;
      throw error;
    }

    const currentResult = await pool.query(
      'SELECT id_livro, titulo, autor, genero, quantidade_exemplares, quantidade_disponivel FROM livro WHERE id_livro = $1',
      [id]
    );

    if (currentResult.rows.length === 0) {
      const error: any = new Error('Item do acervo não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const itemAtual = currentResult.rows[0];

    const titulo = dados.titulo !== undefined || dados.bookTitle !== undefined
      ? formatTitleCase((dados.titulo || dados.bookTitle || '').trim())
      : itemAtual.titulo;

    const autor = dados.autor !== undefined || dados.bookAuthor !== undefined
      ? formatTitleCase((dados.autor || dados.bookAuthor || '').trim())
      : itemAtual.autor;

    const tipo = dados.tipo !== undefined || dados.genero !== undefined || dados.itemType !== undefined
      ? (dados.tipo || dados.genero || dados.itemType || 'Livro').trim()
      : itemAtual.genero;

    const quantidadeRaw = dados.quantidadeTotal !== undefined
      ? dados.quantidadeTotal
      : dados.quantity !== undefined
      ? dados.quantity
      : itemAtual.quantidade_exemplares;

    const quantidade = Number(quantidadeRaw);

    if (!titulo) {
      const error: any = new Error('O título do item não pode ficar vazio.');
      error.statusCode = 400;
      throw error;
    }

    if (!autor) {
      const error: any = new Error('O autor do item não pode ficar vazio.');
      error.statusCode = 400;
      throw error;
    }

    if (isNaN(quantidade) || quantidade < 1) {
      const error: any = new Error('A quantidade de exemplares deve ser um número maior ou igual a 1.');
      error.statusCode = 400;
      throw error;
    }

    const loansResult = await pool.query(
      'SELECT count(*) AS total FROM emprestimo WHERE id_livro = $1 AND LOWER(devolucao) != \'feita\'',
      [id]
    );
    const emprestados = parseInt(loansResult.rows[0].total, 10) || 0;

    if (quantidade < emprestados) {
      const error: any = new Error(`Não é possível reduzir a quantidade para ${quantidade}, pois existem ${emprestados} exemplares emprestados atualmente.`);
      error.statusCode = 400;
      throw error;
    }

    const novaQuantidadeDisponivel = Math.max(0, quantidade - emprestados);

    const updateResult = await pool.query(
      'UPDATE livro SET titulo = $1, autor = $2, genero = $3, quantidade_exemplares = $4, quantidade_disponivel = $5 WHERE id_livro = $6 RETURNING id_livro, titulo, autor, genero, quantidade_exemplares, quantidade_disponivel',
      [titulo, autor, tipo, quantidade, novaQuantidadeDisponivel, id]
    );

    const row = updateResult.rows[0];
    return {
      id: row.id_livro,
      id_livro: row.id_livro,
      titulo: row.titulo,
      bookTitle: row.titulo,
      autor: row.autor,
      bookAuthor: row.autor,
      tipo: row.genero || 'Livro',
      genero: row.genero || 'Livro',
      itemType: row.genero || 'Livro',
      quantidadeTotal: Number(row.quantidade_exemplares),
      quantity: Number(row.quantidade_exemplares),
      quantidadeDisponivel: Number(row.quantidade_disponivel),
      available: Number(row.quantidade_disponivel),
      mensagem: 'Item atualizado com sucesso!',
    };
  }

  public async excluir(id: number) {
    if (isNaN(id) || id <= 0) {
      const error: any = new Error('ID do item inválido.');
      error.statusCode = 400;
      throw error;
    }

    const itemResult = await pool.query(
      'SELECT id_livro, titulo FROM livro WHERE id_livro = $1',
      [id]
    );

    if (itemResult.rows.length === 0) {
      const error: any = new Error('Item do acervo não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const activeLoans = await pool.query(
      'SELECT count(*) AS total FROM emprestimo WHERE id_livro = $1 AND LOWER(devolucao) != \'feita\'',
      [id]
    );

    if (parseInt(activeLoans.rows[0].total, 10) > 0) {
      const error: any = new Error('Não é possível excluir este exemplar pois ele possui empréstimos ativos vinculados.');
      error.statusCode = 400;
      throw error;
    }

    try {
      await pool.query('DELETE FROM fila_espera WHERE id_livro = $1', [id]);
      await pool.query('DELETE FROM livro WHERE id_livro = $1', [id]);
    } catch (dbError: any) {
      if (dbError.code === '23503') {
        const error: any = new Error('Não é possível excluir este exemplar pois ele possui histórico de empréstimos registrado no sistema.');
        error.statusCode = 400;
        throw error;
      }
      throw dbError;
    }

    return {
      id,
      mensagem: 'Item removido do acervo com sucesso!',
    };
  }

  public async adicionarFila(acervoId: number, dados: FilaEsperaDTO) {
    const itemResult = await pool.query(
      'SELECT id_livro, quantidade_disponivel FROM livro WHERE id_livro = $1',
      [acervoId]
    );

    if (itemResult.rows.length === 0) {
      const error: any = new Error('Item do acervo não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const item = itemResult.rows[0];

    if (item.quantidade_disponivel > 0) {
      const error: any = new Error('Existem exemplares disponíveis na estante. Não é permitido entrar na fila.');
      error.statusCode = 400;
      throw error;
    }

    if (!dados.nomeAluno || !dados.nomeAluno.trim()) {
      const error: any = new Error('Nome do aluno é obrigatório.');
      error.statusCode = 400;
      throw error;
    }

    let idPessoa: number;
    const pessoaResult = await pool.query(
      'SELECT id_pessoa FROM pessoa WHERE LOWER(nome) = LOWER($1)',
      [dados.nomeAluno.trim()]
    );

    if (pessoaResult.rows.length > 0) {
      idPessoa = pessoaResult.rows[0].id_pessoa;
    } else {
      const novaPessoa = await pool.query(
        'INSERT INTO pessoa (nome, tipo_pessoa, turma) VALUES ($1, $2, $3) RETURNING id_pessoa',
        [dados.nomeAluno.trim(), 'Aluno', dados.serie?.trim() || null]
      );
      idPessoa = novaPessoa.rows[0].id_pessoa;
    }

    const filaInsert = await pool.query(
      'INSERT INTO fila_espera (id_pessoa, id_livro, data_requisicao) VALUES ($1, $2, NOW()) RETURNING id_fila',
      [idPessoa, acervoId]
    );

    const posResult = await pool.query(
      'SELECT count(*) AS pos FROM fila_espera WHERE id_livro = $1 AND id_fila <= $2',
      [acervoId, filaInsert.rows[0].id_fila]
    );

    return {
      posicaoFila: parseInt(posResult.rows[0].pos, 10),
      mensagem: 'Aluno adicionado à fila de espera.',
    };
  }
}

export const acervoService = new AcervoService();
