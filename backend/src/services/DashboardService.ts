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
