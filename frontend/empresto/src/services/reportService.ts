import { API_BASE_URL, ENDPOINTS } from './apiConfig';
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

function calculateOverviewFromLoans(loans: any[]): ReportsOverview {
  const pendentesMap: Record<string, number> = {};
  const atrasadosMap: Record<string, number> = {};
  const tipoMap: Record<string, number> = {};
  const diaMap: Record<string, number> = {};

  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    diaMap[key] = 0;
  }

  let total30 = 0;
  for (const item of loans) {
    const rawBorrowDate = item.borrowDate || item.data_emprestimo || item.createdAt;
    if (rawBorrowDate) {
      const dateKey = String(rawBorrowDate).slice(0, 10);
      if (dateKey in diaMap) {
        diaMap[dateKey] = (diaMap[dateKey] || 0) + 1;
        total30++;
      }
    }

    const dev = (item.devolucao || '').toLowerCase();
    const isDevolvido = (dev.includes('feita') && !dev.includes('não')) || item.status === 'Devolvido';
    if (isDevolvido) {
      continue;
    }

    const turma = (item.studentClass || item.turma || item.pessoa_turma || '-').trim() || '-';
    const tipo = (item.userType || item.personType || item.tipoPessoa || item.pessoaTipo || 'Aluno').trim() || 'Aluno';
    const isAtrasado = item.status === 'Atrasado' || (item.atraso || '').toLowerCase() === 'sim';

    if (isAtrasado) {
      atrasadosMap[turma] = (atrasadosMap[turma] || 0) + 1;
    } else {
      pendentesMap[turma] = (pendentesMap[turma] || 0) + 1;
    }

    tipoMap[tipo] = (tipoMap[tipo] || 0) + 1;
  }

  const pendentesPorTurma = Object.entries(pendentesMap)
    .map(([turma, total]) => ({ turma, total }))
    .sort((a, b) => b.total - a.total);

  const atrasadosPorTurma = Object.entries(atrasadosMap)
    .map(([turma, total]) => ({ turma, total }))
    .sort((a, b) => b.total - a.total);

  const porTipoPessoa = Object.entries(tipoMap)
    .map(([tipo, total]) => ({ tipo, total }))
    .sort((a, b) => b.total - a.total);

  const porDia = Object.entries(diaMap).map(([dia, total]) => ({ dia, total }));

  const sum = (list: { total: number }[]) => list.reduce((acc, curr) => acc + curr.total, 0);

  return {
    pendentesPorTurma,
    totalPendentes: sum(pendentesPorTurma),
    atrasadosPorTurma,
    totalAtrasados: sum(atrasadosPorTurma),
    porTipoPessoa,
    totalPorTipoPessoa: sum(porTipoPessoa),
    porDia,
    totalUltimos30Dias: total30,
    periodoDias: 30,
    geradoEm: new Date().toISOString(),
  };
}

export const reportService = {
  async getOverview(): Promise<ReportsOverview> {
    const url = REPORT_ENDPOINTS.OVERVIEW;

    try {
      const response = await fetch(url);

      if (response.ok) {
        return await response.json();
      }

      const fallbackRes = await fetch(ENDPOINTS.LOANS);
      if (fallbackRes.ok) {
        const loans = await fallbackRes.json();
        if (Array.isArray(loans)) {
          return calculateOverviewFromLoans(loans);
        }
      }

      await throwApiError(response, 'Não foi possível carregar os relatórios.');
    } catch (error) {
      try {
        const fallbackRes = await fetch(ENDPOINTS.LOANS);
        if (fallbackRes.ok) {
          const loans = await fallbackRes.json();
          if (Array.isArray(loans)) {
            return calculateOverviewFromLoans(loans);
          }
        }
      } catch {}

      toast.error('Erro ao carregar relatórios', errorMessage(error, 'Não foi possível carregar os relatórios.'));
      throw error;
    }

    return calculateOverviewFromLoans([]);
  },
};
