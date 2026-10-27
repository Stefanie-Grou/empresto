import { pool } from '../config/database.js';

export interface ResumoDashboard {
  itensAcervo: number;
  exemplaresTotal: number;
  exemplaresDisponiveis: number;
  emprestimosAtivos: number;
  devolucoesHoje: number;
  emAtraso: number;
  filaEspera: number;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export class DashboardService {
  /**
   * @param hoje data de referência no fuso do cliente (YYYY-MM-DD).
   * Se não vier, usa CURRENT_DATE do banco (comportamento antigo).
   * Assim "hoje" é o dia do usuário, não o do servidor Postgres.
   */
  public async resumo(hoje?: string): Promise<ResumoDashboard> {
    const dataReferencia = hoje && ISO_DATE.test(hoje) ? hoje : null;

    // Mesma regra de "devolvido" usada em EmprestimoService.listar:
    // devolucao contém "feita" e não é a negativa ("Não feita").
    const devolvidoSql = `(LOWER(COALESCE(e.devolucao, '')) LIKE '%feita%'
      AND LOWER(COALESCE(e.devolucao, '')) NOT LIKE '%não%')`;

    const atrasoTexto = `LOWER(COALESCE(e.atraso, '')) = 'sim'`;

    const hojeSql = dataReferencia ? '$1::date' : 'CURRENT_DATE';

    const { rows } = await pool.query(
      `
      SELECT
        (SELECT count(*) FROM livro) AS itens_acervo,
        (SELECT COALESCE(sum(quantidade_exemplares), 0) FROM livro) AS exemplares_total,
        (SELECT COALESCE(sum(quantidade_disponivel), 0) FROM livro) AS exemplares_disponiveis,
        (SELECT count(*) FROM emprestimo e WHERE NOT ${devolvidoSql}) AS emprestimos_ativos,
        (
          SELECT count(*)
          FROM emprestimo e
          WHERE NOT ${devolvidoSql}
            AND e.prazo_devolucao = ${hojeSql}
        ) AS devolucoes_hoje,
        (
          SELECT count(*)
          FROM emprestimo e
          WHERE NOT ${devolvidoSql}
            AND (e.prazo_devolucao < ${hojeSql} OR ${atrasoTexto})
        ) AS em_atraso,
        (SELECT count(*) FROM fila_espera) AS fila_espera
    `,
      dataReferencia ? [dataReferencia] : []
    );

    const row = rows[0];

    return {
      itensAcervo: Number(row.itens_acervo) || 0,
      exemplaresTotal: Number(row.exemplares_total) || 0,
      exemplaresDisponiveis: Number(row.exemplares_disponiveis) || 0,
      emprestimosAtivos: Number(row.emprestimos_ativos) || 0,
      devolucoesHoje: Number(row.devolucoes_hoje) || 0,
      emAtraso: Number(row.em_atraso) || 0,
      filaEspera: Number(row.fila_espera) || 0,
    };
  }
}

export const dashboardService = new DashboardService();

import { pool } from '../config/database.js';

export class DashboardService {
  public async getStats() {
    // Totais do acervo
    const acervoRes = await pool.query(`
      SELECT
        COALESCE(SUM(quantidade_exemplares), 0)::int AS total_exemplares,
        COALESCE(SUM(quantidade_disponivel), 0)::int AS total_disponiveis,
        COUNT(*)::int AS total_titulos,
        COUNT(*) FILTER (WHERE created_at >= date_trunc('month', CURRENT_DATE))::int AS novos_este_mes
      FROM livro
    `);

    // Estatísticas de empréstimos
    const emprestimosRes = await pool.query(`
      SELECT
        COUNT(*) FILTER (
          WHERE (devolucao ILIKE '%não%' OR devolucao IS NULL)
        )::int AS ativos,

        COUNT(*) FILTER (
          WHERE data_emprestimo = CURRENT_DATE
        )::int AS emprestimos_hoje,

        COUNT(*) FILTER (
          WHERE (devolucao ILIKE '%não%' OR devolucao IS NULL)
            AND prazo_devolucao = CURRENT_DATE
        )::int AS devolucoes_vencendo_hoje,

        COUNT(*) FILTER (
          WHERE devolucao NOT ILIKE '%não%'
            AND data_emprestimo >= CURRENT_DATE - INTERVAL '1 day'
        )::int AS devolucoes_hoje,

        COUNT(*) FILTER (
          WHERE (devolucao ILIKE '%não%' OR devolucao IS NULL)
            AND (prazo_devolucao < CURRENT_DATE OR atraso ILIKE 'sim')
        )::int AS atrasados
      FROM emprestimo
    `);

    const acervo = acervoRes.rows[0];
    const emp = emprestimosRes.rows[0];

    return {
      acervo: {
        totalExemplares: acervo.total_exemplares,
        totalDisponiveis: acervo.total_disponiveis,
        totalTitulos: acervo.total_titulos,
        novosEsteMes: acervo.novos_este_mes,
      },
      emprestimos: {
        ativos: emp.ativos,
        emprestimosHoje: emp.emprestimos_hoje,
        devolucoesVencendoHoje: emp.devolucoes_vencendo_hoje,
        devolucoesHoje: emp.devolucoes_hoje,
        atrasados: emp.atrasados,
      },
    };
  }
}

export const dashboardService = new DashboardService();
