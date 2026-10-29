import { useState, useCallback } from 'react';
import { reportService, type ReportsOverview } from '../../services/reportService';

export const EMPTY_REPORTS: ReportsOverview = {
  pendentesPorTurma: [],
  totalPendentes: 0,
  atrasadosPorTurma: [],
  totalAtrasados: 0,
  porTipoPessoa: [],
  totalPorTipoPessoa: 0,
  porDia: [],
  totalUltimos30Dias: 0,
  periodoDias: 30,
  geradoEm: '',
};

export function useReports() {
  const [data, setData] = useState<ReportsOverview>(EMPTY_REPORTS);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const overview = await reportService.getOverview();
      setData(overview);
    } catch {
      // O toast de erro é exibido pelo reportService
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, load };
}
