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

// Data de "hoje" no fuso do navegador, no formato YYYY-MM-DD
export function getLocalISODate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const dashboardService = {
  // Envia a data local do cliente (YYYY-MM-DD) para que "hoje" no banco seja
  // o mesmo dia do usuário, e não o fuso do servidor Postgres.
  async getSummary(today: string = getLocalISODate()): Promise<DashboardSummary> {
    const url = `${DASHBOARD_ENDPOINTS.SUMMARY}?hoje=${encodeURIComponent(today)}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        await throwApiError(response, 'Não foi possível carregar o resumo do dashboard.');
      }

      return await response.json();
    } catch (error) {
      toast.error('Erro ao carregar resumo', errorMessage(error, 'Não foi possível carregar o resumo do dashboard.'));
      throw error;
    }
  },
};
