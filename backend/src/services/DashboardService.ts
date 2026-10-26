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
