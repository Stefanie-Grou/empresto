import { pool } from '../config/database.js';

export interface TurmaSlice {
  turma: string;
  total: number;
}

export interface TipoPessoaSlice {
  tipo: string;
  total: number;
}

export interface MesSlice {
  dia: string;
  total: number;
}

export interface ResumoRelatorios {
  pendentesPorTurma: TurmaSlice[];
  totalPendentes: number;
  atrasadosPorTurma: TurmaSlice[];
  totalAtrasados: number;
  porTipoPessoa: TipoPessoaSlice[];
  totalPorTipoPessoa: number;
  porDia: MesSlice[];
  totalUltimos30Dias: number;
  periodoDias: number;
  geradoEm: string;
}

export class ReportService {
  public async resumo(): Promise<ResumoRelatorios> {

    // Mesma regra de "devolvido" usada em EmprestimoService.listar:
    // devolucao contém "feita" e não é a negativa ("Não feita").
    const devolvidoSql = `(LOWER(COALESCE(e.devolucao, '')) LIKE '%feita%'
      AND LOWER(COALESCE(e.devolucao, '')) NOT LIKE '%não%')`;

    const atrasoSql = `(e.prazo_devolucao < CURRENT_DATE OR LOWER(COALESCE(e.atraso, '')) = 'sim')`;

    const turmaSql = `COALESCE(NULLIF(TRIM(COALESCE(p.turma, '')), ''), 'Sem turma')`;
    const tipoSql = `COALESCE(NULLIF(TRIM(COALESCE(p.tipo_pessoa, '')), ''), 'Aluno')`;

    // a. Pendentes por turma (ativos e não atrasados)
    const pendentes = await pool.query(
      `
      SELECT ${turmaSql} AS turma, count(*)::int AS total
      FROM emprestimo e
      JOIN pessoa p ON p.id_pessoa = e.id_pessoa
      WHERE NOT ${devolvidoSql}
        AND NOT ${atrasoSql}
      GROUP BY 1
      ORDER BY total DESC, turma ASC
      `
    );

    // b. Atrasados por turma
    const atrasados = await pool.query(
      `
      SELECT ${turmaSql} AS turma, count(*)::int AS total
      FROM emprestimo e
      JOIN pessoa p ON p.id_pessoa = e.id_pessoa
      WHERE NOT ${devolvidoSql}
        AND ${atrasoSql}
      GROUP BY 1
      ORDER BY total DESC, turma ASC
      `
    );

    // c. Empréstimos ativos por tipo de pessoa
    const porTipo = await pool.query(
      `
      SELECT ${tipoSql} AS tipo, count(*)::int AS total
      FROM emprestimo e
      JOIN pessoa p ON p.id_pessoa = e.id_pessoa
      WHERE NOT ${devolvidoSql}
      GROUP BY 1
      ORDER BY total DESC, tipo ASC
      `
    );

    // d. Empréstimos por dia nos últimos 30 dias (todos, independente do status)
    const porDia = await pool.query(
      `
      SELECT to_char(d.dia, 'YYYY-MM-DD') AS dia, count(e.id_emprestimo)::int AS total
      FROM generate_series(
        CURRENT_DATE - INTERVAL '29 days',
        CURRENT_DATE,
        '1 day'
      ) AS d(dia)
      LEFT JOIN emprestimo e ON e.data_emprestimo = d.dia
      GROUP BY 1
      ORDER BY 1
      `
    );

    // Total bruto dos últimos 30 dias (independente do status)
    const totalUltimos30Dias = porDia.rows.reduce(
      (acc: number, row: { total: number }) => acc + Number(row.total),
      0
    );

    const soma = (rows: { total: number }[]) => rows.reduce((acc, row) => acc + Number(row.total), 0);

    return {
      pendentesPorTurma: pendentes.rows,
      totalPendentes: soma(pendentes.rows),
      atrasadosPorTurma: atrasados.rows,
      totalAtrasados: soma(atrasados.rows),
      porTipoPessoa: porTipo.rows,
      totalPorTipoPessoa: soma(porTipo.rows),
      porDia: porDia.rows,
      totalUltimos30Dias,
      periodoDias: 30,
      geradoEm: new Date().toISOString(),
    };
  }
}

export const reportService = new ReportService();
