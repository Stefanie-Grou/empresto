import { useEffect } from 'react';
import { Icon } from '@iconify/react';
import ReportsGrid from '../components/reports/ReportsGrid';
import { useReports } from '../components/reports/useReports';

export default function ReportsPage() {
  const { data, isLoading, load } = useReports();

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="w-full flex justify-between items-center pb-1">
        <div className="flex flex-col">
          <h2 className="text-3xl font-playfair font-bold leading-tight text-gray-900">
            Relatórios
          </h2>
          <p className="text-sm text-gray-500 font-sans">
            Acompanhe pendências, atrasos e movimentação dos empréstimos.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer shrink-0"
        >
          <Icon icon="lucide:refresh-cw" className="w-4 h-4" />
          <span>Atualizar dados</span>
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white-background border border-100-gray rounded-2xl p-20 shadow-xs">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-800 animate-bounce" style={{ animationDelay: '-0.3s' }} />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-800 animate-bounce" style={{ animationDelay: '-0.15s' }} />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-800 animate-bounce" />
          </div>
        </div>
      ) : (
        <ReportsGrid data={data} isLoading={isLoading} />
      )}
    </div>
  );
}
