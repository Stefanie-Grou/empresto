import { DASHBOARD_ENDPOINTS } from './apiConfig';
import { toast } from './toastStore';
import { throwApiError, errorMessage } from './apiError';

export interface DashboardSummary {
  itensAcervo: number;
  exemplaresTotal: number;
  exemplaresDisponiveis: number;
  emprestimosAtivos: number;
  devolucoesHoje: number;
  emAtraso: number;
  filaEspera: number;
}

export const EMPTY_DASHBOARD_SUMMARY: DashboardSummary = {
  itensAcervo: 0,
  exemplaresTotal: 0,
  exemplaresDisponiveis: 0,
  emprestimosAtivos: 0,
  devolucoesHoje: 0,
  emAtraso: 0,
  filaEspera: 0,
};

export function getLocalISODate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const dashboardService = {
  async getSummary(today: string = getLocalISODate()): Promise<DashboardSummary> {
    const url = `${DASHBOARD_ENDPOINTS.SUMMARY}?hoje=${encodeURIComponent(today)}`;

    try {
      const response = await fetch(url);

      if (response.ok) {
        return await response.json();
      }

      const fallbackUrl = DASHBOARD_ENDPOINTS.SUMMARY.replace(/\/resumo$/, '/stats');
      const fallbackResponse = await fetch(fallbackUrl);

      if (fallbackResponse.ok) {
        const stats = await fallbackResponse.json();
        return {
          itensAcervo: stats.acervo?.totalTitulos ?? stats.acervo?.totalExemplares ?? 0,
          exemplaresTotal: stats.acervo?.totalExemplares ?? 0,
          exemplaresDisponiveis: stats.acervo?.totalDisponiveis ?? 0,
          emprestimosAtivos: stats.emprestimos?.ativos ?? 0,
          devolucoesHoje: stats.emprestimos?.devolucoesVencendoHoje ?? stats.emprestimos?.devolucoesHoje ?? 0,
          emAtraso: stats.emprestimos?.atrasados ?? 0,
          filaEspera: 0,
        };
      }

      await throwApiError(response, 'Não foi possível carregar o resumo do dashboard.');
      return EMPTY_DASHBOARD_SUMMARY;
    } catch (error) {
      toast.error('Erro ao carregar resumo', errorMessage(error, 'Não foi possível carregar o resumo do dashboard.'));
      throw error;
    }
  },
};
