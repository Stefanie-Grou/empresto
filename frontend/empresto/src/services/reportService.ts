import { API_BASE_URL } from './apiConfig';
import { toast } from './toastStore';
import { throwApiError, errorMessage } from './apiError';

export const REPORT_ENDPOINTS = {
  OVERVIEW: `${API_BASE_URL}/relatorios/resumo`,
};

export interface TurmaSlice {
  turma: string;
  total: number;
}

export interface TipoPessoaSlice {
  tipo: string;
  total: number;
}

export interface DiaSlice {
  dia: string;
  total: number;
}

export interface ReportsOverview {
  pendentesPorTurma: TurmaSlice[];
  totalPendentes: number;
  atrasadosPorTurma: TurmaSlice[];
  totalAtrasados: number;
  porTipoPessoa: TipoPessoaSlice[];
  totalPorTipoPessoa: number;
  porDia: DiaSlice[];
  totalUltimos30Dias: number;
  periodoDias: number;
  geradoEm: string;
}

export const reportService = {
  async getOverview(): Promise<ReportsOverview> {
    const url = REPORT_ENDPOINTS.OVERVIEW;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        await throwApiError(response, 'Não foi possível carregar os relatórios.');
      }

      return await response.json();
    } catch (error) {
      toast.error('Erro ao carregar relatórios', errorMessage(error, 'Não foi possível carregar os relatórios.'));
      throw error;
    }
  },
};
