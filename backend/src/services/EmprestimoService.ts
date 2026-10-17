import { pool } from '../config/database.js';

export interface NovoEmprestimoDTO {
  nomeAluno?: string;
  studentName?: string;
  turma?: string;
  studentClass?: string;
  livroId?: number;
  bookId?: number;
  prazoDevolucao?: string;
  dueDate?: string;
}

export interface AtualizarEmprestimoDTO {
  nomeAluno?: string;
  studentName?: string;
  turma?: string;
  studentClass?: string;
  livroId?: number;
  bookId?: number;
  prazoDevolucao?: string;
  dueDate?: string;
  status?: string;
  devolucao?: string;
}

function parseDateInput(value: string): string {
  const trimmed = value.trim();
  if (trimmed.includes('/')) {
    const parts = trimmed.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
  }
  return trimmed;
}

export class EmprestimoService {
  public async listar(busca?: string, statusFiltro?: string) {
    let query = `
      SELECT 
        e.id_emprestimo,
        e.id_livro,
        l.titulo as livro_titulo,
        l.autor as livro_autor,
        l.genero as livro_genero,
        l.quantidade_disponivel,
        e.id_pessoa,
        p.nome as pessoa_nome,
        p.turma as pessoa_turma,
        e.data_emprestimo,
        e.prazo_devolucao,
        e.devolucao,
        e.atraso
      FROM emprestimo e
      JOIN livro l ON l.id_livro = e.id_livro
      JOIN pessoa p ON p.id_pessoa = e.id_pessoa
    `;

    const params: any[] = [];
    if (busca && busca.trim()) {
      query += ` WHERE LOWER(l.titulo) LIKE $1 
                 OR LOWER(l.autor) LIKE $1 
                 OR LOWER(p.nome) LIKE $1 
                 OR LOWER(COALESCE(p.turma, '')) LIKE $1 
                 OR CAST(e.id_emprestimo AS TEXT) LIKE $1`;
      params.push(`%${busca.toLowerCase().trim()}%`);
    }

    query += ' ORDER BY e.id_emprestimo DESC';

    const { rows } = await pool.query(query, params);

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const items = rows.map((row) => {
      const prazo = new Date(row.prazo_devolucao);
      prazo.setHours(0, 0, 0, 0);

      const isDevolvido = row.devolucao && row.devolucao.toLowerCase().includes('feita') && !row.devolucao.toLowerCase().includes('não');
      let status: 'Devolvido' | 'Atrasado' | 'Pendente';

      if (isDevolvido) {
        status = 'Devolvido';
      } else if (prazo < hoje || (row.atraso && row.atraso.toLowerCase() === 'sim')) {
        status = 'Atrasado';
      } else {
        status = 'Pendente';
      }

      const d = new Date(row.prazo_devolucao);
      const dia = String(d.getUTCDate()).padStart(2, '0');
      const mes = String(d.getUTCMonth() + 1).padStart(2, '0');
      const ano = d.getUTCFullYear();
      const dueDateFormatted = `${dia}/${mes}/${ano}`;
      const dueDateIso = `${ano}-${mes}-${dia}`;

      return {
        id: row.id_emprestimo,
        id_emprestimo: row.id_emprestimo,
        bookId: row.id_livro,
        id_livro: row.id_livro,
        bookTitle: row.livro_titulo,
        bookAuthor: row.livro_autor,
        studentId: row.id_pessoa,
        id_pessoa: row.id_pessoa,
        studentName: row.pessoa_nome,
        studentClass: (row.pessoa_turma || '').replace(/\uFFFD/g, 'º'),
        turma: (row.pessoa_turma || '').replace(/\uFFFD/g, 'º'),
        borrowDate: row.data_emprestimo,
        dueDate: dueDateFormatted,
        rawDueDate: dueDateIso,
        status,
        devolucao: row.devolucao,
        atraso: row.atraso,
      };
    });

    if (statusFiltro && statusFiltro !== 'all') {
      return items.filter((item) => item.status.toLowerCase() === statusFiltro.toLowerCase());
    }

    return items;
  }

  public async buscarPorId(id: number) {
    if (isNaN(id) || id <= 0) {
      const error: any = new Error('ID do empréstimo inválido.');
      error.statusCode = 400;
      throw error;
    }

    const { rows } = await pool.query(
      `SELECT 
        e.id_emprestimo,
        e.id_livro,
        l.titulo as livro_titulo,
        l.autor as livro_autor,
        e.id_pessoa,
        p.nome as pessoa_nome,
        p.turma as pessoa_turma,
        e.data_emprestimo,
        e.prazo_devolucao,
        e.devolucao,
        e.atraso
      FROM emprestimo e
      JOIN livro l ON l.id_livro = e.id_livro
      JOIN pessoa p ON p.id_pessoa = e.id_pessoa
      WHERE e.id_emprestimo = $1`,
      [id]
    );

    if (rows.length === 0) {
      const error: any = new Error('Empréstimo não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const row = rows[0];
    const prazo = new Date(row.prazo_devolucao);
    prazo.setHours(0, 0, 0, 0);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const isDevolvido = row.devolucao && row.devolucao.toLowerCase().includes('feita') && !row.devolucao.toLowerCase().includes('não');
    let status: 'Devolvido' | 'Atrasado' | 'Pendente';
    if (isDevolvido) {
      status = 'Devolvido';
    } else if (prazo < hoje || (row.atraso && row.atraso.toLowerCase() === 'sim')) {
      status = 'Atrasado';
    } else {
      status = 'Pendente';
    }

    const d = new Date(row.prazo_devolucao);
    const dia = String(d.getUTCDate()).padStart(2, '0');
    const mes = String(d.getUTCMonth() + 1).padStart(2, '0');
    const ano = d.getUTCFullYear();
    const dueDateFormatted = `${dia}/${mes}/${ano}`;
    const dueDateIso = `${ano}-${mes}-${dia}`;

    return {
      id: row.id_emprestimo,
      id_emprestimo: row.id_emprestimo,
      bookId: row.id_livro,
      id_livro: row.id_livro,
      bookTitle: row.livro_titulo,
      bookAuthor: row.livro_autor,
      studentId: row.id_pessoa,
      id_pessoa: row.id_pessoa,
      studentName: row.pessoa_nome,
      studentClass: (row.pessoa_turma || '').replace(/\uFFFD/g, 'º'),
      turma: (row.pessoa_turma || '').replace(/\uFFFD/g, 'º'),
      borrowDate: row.data_emprestimo,
      dueDate: dueDateFormatted,
      rawDueDate: dueDateIso,
      status,
      devolucao: row.devolucao,
      atraso: row.atraso,
    };
  }

  public async registrar(dados: NovoEmprestimoDTO) {
    const nomeAluno = (dados.nomeAluno || dados.studentName || '').trim();
    const turma = (dados.turma || dados.studentClass || '').replace(/\uFFFD/g, 'º').trim();
    const livroIdRaw = dados.livroId !== undefined ? dados.livroId : dados.bookId;
    const livroId = Number(livroIdRaw);
    const prazoRaw = (dados.prazoDevolucao || dados.dueDate || '').trim();

    if (!nomeAluno) {
      const error: any = new Error('O nome do aluno é obrigatório.');
      error.statusCode = 400;
      throw error;
    }

    if (isNaN(livroId) || livroId <= 0) {
      const error: any = new Error('Selecione um livro válido.');
      error.statusCode = 400;
      throw error;
    }

    if (!prazoRaw) {
      const error: any = new Error('O prazo de devolução é obrigatório.');
      error.statusCode = 400;
      throw error;
    }

    const prazoIso = parseDateInput(prazoRaw);

    const livroRes = await pool.query(
      'SELECT id_livro, titulo, quantidade_disponivel FROM livro WHERE id_livro = $1',
      [livroId]
    );

    if (livroRes.rows.length === 0) {
      const error: any = new Error('Livro não encontrado no acervo.');
      error.statusCode = 404;
      throw error;
    }

    const livro = livroRes.rows[0];

    if (livro.quantidade_disponivel <= 0) {
      const error: any = new Error(`Nenhum exemplar disponível de "${livro.titulo}" no momento.`);
      error.statusCode = 400;
      throw error;
    }

    let idPessoa: number;
    const pessoaRes = await pool.query(
      'SELECT id_pessoa FROM pessoa WHERE LOWER(nome) = LOWER($1)',
      [nomeAluno]
    );

    if (pessoaRes.rows.length > 0) {
      idPessoa = pessoaRes.rows[0].id_pessoa;
      if (turma) {
        await pool.query('UPDATE pessoa SET turma = $1 WHERE id_pessoa = $2', [turma, idPessoa]);
      }
    } else {
      const novaPessoa = await pool.query(
        'INSERT INTO pessoa (nome, tipo_pessoa, turma) VALUES ($1, $2, $3) RETURNING id_pessoa',
        [nomeAluno, 'Aluno', turma || null]
      );
      idPessoa = novaPessoa.rows[0].id_pessoa;
    }

    await pool.query(
      'UPDATE livro SET quantidade_disponivel = quantidade_disponivel - 1 WHERE id_livro = $1',
      [livroId]
    );

    const empRes = await pool.query(
      `INSERT INTO emprestimo (id_pessoa, id_livro, data_emprestimo, prazo_devolucao, devolucao, atraso)
       VALUES ($1, $2, CURRENT_DATE, $3, 'Não feita', 'Não')
       RETURNING id_emprestimo`,
      [idPessoa, livroId, prazoIso]
    );

    return {
      id: empRes.rows[0].id_emprestimo,
      mensagem: 'Empréstimo registrado com sucesso!',
    };
  }

  public async atualizar(id: number, dados: AtualizarEmprestimoDTO) {
    if (isNaN(id) || id <= 0) {
      const error: any = new Error('ID do empréstimo inválido.');
      error.statusCode = 400;
      throw error;
    }

    const empRes = await pool.query(
      'SELECT id_emprestimo, id_pessoa, id_livro, devolucao, prazo_devolucao FROM emprestimo WHERE id_emprestimo = $1',
      [id]
    );

    if (empRes.rows.length === 0) {
      const error: any = new Error('Empréstimo não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const emprestimoAtual = empRes.rows[0];
    const nomeAluno = (dados.nomeAluno || dados.studentName || '').trim();
    const turma = (dados.turma || dados.studentClass || '').replace(/\uFFFD/g, 'º').trim();
    const livroIdRaw = dados.livroId !== undefined ? dados.livroId : dados.bookId;
    const novoLivroId = livroIdRaw ? Number(livroIdRaw) : emprestimoAtual.id_livro;
    const prazoRaw = (dados.prazoDevolucao || dados.dueDate || '').trim();

    if (nomeAluno) {
      await pool.query(
        'UPDATE pessoa SET nome = $1, turma = COALESCE(NULLIF($2, \'\'), turma) WHERE id_pessoa = $3',
        [nomeAluno, turma, emprestimoAtual.id_pessoa]
      );
    } else if (turma) {
      await pool.query('UPDATE pessoa SET turma = $1 WHERE id_pessoa = $2', [turma, emprestimoAtual.id_pessoa]);
    }

    const wasDevolvido = emprestimoAtual.devolucao && emprestimoAtual.devolucao.toLowerCase().includes('feita') && !emprestimoAtual.devolucao.toLowerCase().includes('não');
    let newDevolucao = emprestimoAtual.devolucao;
    let newAtraso = emprestimoAtual.atraso;

    if (dados.status || dados.devolucao) {
      const statusInput = (dados.status || dados.devolucao || '').toLowerCase();
      if (statusInput === 'devolvido' || statusInput === 'feita') {
        newDevolucao = 'Feita';
        newAtraso = 'Não';
        if (!wasDevolvido) {
          await pool.query('UPDATE livro SET quantidade_disponivel = quantidade_disponivel + 1 WHERE id_livro = $1', [emprestimoAtual.id_livro]);
        }
      } else {
        newDevolucao = 'Não feita';
        newAtraso = statusInput === 'atrasado' ? 'Sim' : 'Não';
        if (wasDevolvido) {
          await pool.query('UPDATE livro SET quantidade_disponivel = GREATEST(0, quantidade_disponivel - 1) WHERE id_livro = $1', [emprestimoAtual.id_livro]);
        }
      }
    }

    if (novoLivroId !== emprestimoAtual.id_livro) {
      const novoLivroRes = await pool.query(
        'SELECT id_livro, quantidade_disponivel FROM livro WHERE id_livro = $1',
        [novoLivroId]
      );
      if (novoLivroRes.rows.length === 0) {
        const error: any = new Error('Novo livro não encontrado.');
        error.statusCode = 404;
        throw error;
      }

      if (newDevolucao === 'Não feita') {
        if (novoLivroRes.rows[0].quantidade_disponivel <= 0) {
          const error: any = new Error('Nenhum exemplar disponível do novo livro selecionado.');
          error.statusCode = 400;
          throw error;
        }
        await pool.query('UPDATE livro SET quantidade_disponivel = quantidade_disponivel - 1 WHERE id_livro = $1', [novoLivroId]);
        if (!wasDevolvido) {
          await pool.query('UPDATE livro SET quantidade_disponivel = quantidade_disponivel + 1 WHERE id_livro = $1', [emprestimoAtual.id_livro]);
        }
      }
    }

    const prazoIso = prazoRaw ? parseDateInput(prazoRaw) : emprestimoAtual.prazo_devolucao;

    await pool.query(
      `UPDATE emprestimo 
       SET id_livro = $1, prazo_devolucao = $2, devolucao = $3, atraso = $4 
       WHERE id_emprestimo = $5`,
      [novoLivroId, prazoIso, newDevolucao, newAtraso, id]
    );

    return {
      id,
      mensagem: 'Empréstimo atualizado com sucesso!',
    };
  }

  public async renovar(id: number, diasAdicionais = 7) {
    if (isNaN(id) || id <= 0) {
      const error: any = new Error('ID do empréstimo inválido.');
      error.statusCode = 400;
      throw error;
    }

    const empRes = await pool.query(
      'SELECT id_emprestimo, id_livro, devolucao, prazo_devolucao FROM emprestimo WHERE id_emprestimo = $1',
      [id]
    );

    if (empRes.rows.length === 0) {
      const error: any = new Error('Empréstimo não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const emp = empRes.rows[0];
    const isDevolvido = emp.devolucao && emp.devolucao.toLowerCase().includes('feita') && !emp.devolucao.toLowerCase().includes('não');
    if (isDevolvido) {
      const error: any = new Error('Não é possível renovar um empréstimo já devolvido.');
      error.statusCode = 400;
      throw error;
    }

    const updateRes = await pool.query(
      `UPDATE emprestimo 
       SET prazo_devolucao = GREATEST(prazo_devolucao, CURRENT_DATE) + ($1 || ' days')::INTERVAL,
           atraso = 'Não'
       WHERE id_emprestimo = $2
       RETURNING prazo_devolucao`,
      [String(diasAdicionais), id]
    );

    const d = new Date(updateRes.rows[0].prazo_devolucao);
    const dia = String(d.getUTCDate()).padStart(2, '0');
    const mes = String(d.getUTCMonth() + 1).padStart(2, '0');
    const ano = d.getUTCFullYear();
    const novoPrazoFormatado = `${dia}/${mes}/${ano}`;

    return {
      id,
      novoPrazo: novoPrazoFormatado,
      mensagem: `Empréstimo renovado com sucesso até ${novoPrazoFormatado}!`,
    };
  }

  public async devolver(id: number) {
    if (isNaN(id) || id <= 0) {
      const error: any = new Error('ID do empréstimo inválido.');
      error.statusCode = 400;
      throw error;
    }

    const empRes = await pool.query(
      'SELECT id_emprestimo, id_livro, devolucao FROM emprestimo WHERE id_emprestimo = $1',
      [id]
    );

    if (empRes.rows.length === 0) {
      const error: any = new Error('Empréstimo não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const emp = empRes.rows[0];
    const isDevolvido = emp.devolucao && emp.devolucao.toLowerCase().includes('feita') && !emp.devolucao.toLowerCase().includes('não');
    if (isDevolvido) {
      const error: any = new Error('Este empréstimo já consta como devolvido.');
      error.statusCode = 400;
      throw error;
    }

    await pool.query('UPDATE emprestimo SET devolucao = \'Feita\', atraso = \'Não\' WHERE id_emprestimo = $1', [id]);
    await pool.query('UPDATE livro SET quantidade_disponivel = quantidade_disponivel + 1 WHERE id_livro = $1', [emp.id_livro]);

    return {
      id,
      mensagem: 'Devolução registrada com sucesso!',
    };
  }

  public async excluir(id: number) {
    if (isNaN(id) || id <= 0) {
      const error: any = new Error('ID do empréstimo inválido.');
      error.statusCode = 400;
      throw error;
    }

    const empRes = await pool.query(
      'SELECT id_emprestimo, id_livro, devolucao FROM emprestimo WHERE id_emprestimo = $1',
      [id]
    );

    if (empRes.rows.length === 0) {
      const error: any = new Error('Empréstimo não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const emp = empRes.rows[0];
    const isDevolvido = emp.devolucao && emp.devolucao.toLowerCase().includes('feita') && !emp.devolucao.toLowerCase().includes('não');

    if (!isDevolvido) {
      await pool.query('UPDATE livro SET quantidade_disponivel = quantidade_disponivel + 1 WHERE id_livro = $1', [emp.id_livro]);
    }

    await pool.query('DELETE FROM emprestimo WHERE id_emprestimo = $1', [id]);

    return {
      id,
      mensagem: 'Empréstimo removido com sucesso!',
    };
  }
}

export const emprestimoService = new EmprestimoService();
