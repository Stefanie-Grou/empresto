import DonutChart, { type DonutSlice } from './DonutChart';
import LineChart from './LineChart';
import { REPORT_COLORS, paletteColor } from './reportColors';
import type { ReportsOverview } from '../../services/reportService';

interface ReportCardProps {
  title: string;
  subtitle: string;
  total?: number | string;
  totalLabel?: string;
  loading?: boolean;
  children: React.ReactNode;
}

function ReportCard({ title, subtitle, total, totalLabel, loading, children }: ReportCardProps) {
  return (
    <section className="bg-white-background border border-100-gray rounded-2xl p-6 shadow-xs font-jakarta">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-base font-bold text-full-black leading-tight">{title}</h2>
          <p className="text-xs text-gray-500 mt-1 leading-snug">{subtitle}</p>
        </div>
        {total !== undefined && (
          <div className="text-right shrink-0">
            <div className="text-3xl font-normal tracking-tight text-full-black">
              {loading ? '—' : total}
            </div>
            {totalLabel && <div className="text-xs text-gray-500">{totalLabel}</div>}
          </div>
        )}
      </div>
      {children}
    </section>
  );
}

interface LegendProps {
  items: { label: string; value: number; color: string }[];
  total: number;
}

function Legend({ items, total }: LegendProps) {
  if (items.length === 0) {
    return <p className="text-xs text-gray-400 py-4">Nenhum dado disponível</p>;
  }

  return (
    <ul className="flex flex-col gap-2 max-h-52 overflow-y-auto pr-1">
      {items.map((item) => {
        const percent = total > 0 ? Math.round((item.value / total) * 100) : 0;
        return (
          <li key={item.label} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="flex-1 text-gray-700 font-medium truncate">{item.label}</span>
            <span className="text-gray-500 tabular-nums">
              {item.value} ({percent}%)
            </span>
          </li>
        );
      })}
    </ul>
  );
}

const numberFormatter = new Intl.NumberFormat('pt-BR');
function formatTotal(value: number): string {
  return numberFormatter.format(Number.isFinite(value) ? value : 0);
}

const TIPO_LABEL: Record<string, string> = {
  Aluno: 'Alunos',
  Professor: 'Professores',
  Professora: 'Professores',
  Funcionário: 'Funcionários',
  Funcionaria: 'Funcionários',
};

function tipoPessoaLabel(tipo: string): string {
  const clean = tipo.trim();
  if (TIPO_LABEL[clean]) return TIPO_LABEL[clean];
  const lower = clean.toLowerCase();
  if (lower.startsWith('professor')) return 'Professores';
  if (lower.startsWith('funcion')) return 'Funcionários';
  if (lower === 'aluno') return 'Alunos';
  return clean || 'Não informado';
}

function tipoPessoaColor(tipo: string): string {
  const lower = tipo.trim().toLowerCase();
  if (lower === 'aluno') return REPORT_COLORS.aluno;
  if (lower.startsWith('professor')) return REPORT_COLORS.professor;
  if (lower.startsWith('funcion')) return REPORT_COLORS.funcionario;
  return REPORT_COLORS.linha;
}

interface ReportsGridProps {
  data: ReportsOverview;
  isLoading: boolean;
}

export default function ReportsGrid({ data, isLoading }: ReportsGridProps) {
  // a. Pendentes por turma (pizza)
  const pendentesSlices: DonutSlice[] = data.pendentesPorTurma.map((slice, index) => ({
    label: slice.turma,
    value: slice.total,
    color: paletteColor(index),
  }));

  const pendentesLegend = pendentesSlices.map((slice) => ({
    label: slice.label,
    value: slice.value,
    color: slice.color,
  }));

  // b. Atrasados por turma (pizza)
  const atrasadosSlices: DonutSlice[] = data.atrasadosPorTurma.map((slice, index) => ({
    label: slice.turma,
    value: slice.total,
    color: paletteColor(index),
  }));

  const atrasadosLegend = atrasadosSlices.map((slice) => ({
    label: slice.label,
    value: slice.value,
    color: slice.color,
  }));

  // c. Por tipo de pessoa (pizza)
  const tipoSlices: DonutSlice[] = data.porTipoPessoa.map((slice) => ({
    label: tipoPessoaLabel(slice.tipo),
    value: slice.total,
    color: tipoPessoaColor(slice.tipo),
  }));

  const tipoLegend = tipoSlices.map((slice) => ({
    label: slice.label,
    value: slice.value,
    color: slice.color,
  }));

  // d. Empréstimos por dia nos últimos 30 dias (linha)
  const lineData = data.porDia.map((day) => ({ label: day.dia, value: day.total }));

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportCard
          title="Livros pendentes por turma"
          subtitle="Empréstimos ativos, sem atraso, agrupados por turma"
          total={formatTotal(data.totalPendentes)}
          totalLabel="pendentes"
          loading={isLoading}
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <DonutChart
              data={pendentesSlices}
              centerTop={isLoading ? '—' : formatTotal(data.totalPendentes)}
              centerBottom="pendentes"
            />
            <div className="flex-1 w-full min-w-0">
              <Legend items={pendentesLegend} total={data.totalPendentes} />
            </div>
          </div>
        </ReportCard>

        <ReportCard
          title="Livros atrasados por turma"
          subtitle="Empréstimos vencidos, agrupados por turma"
          total={formatTotal(data.totalAtrasados)}
          totalLabel="atrasados"
          loading={isLoading}
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <DonutChart
              data={atrasadosSlices}
              centerTop={isLoading ? '—' : formatTotal(data.totalAtrasados)}
              centerBottom="atrasados"
            />
            <div className="flex-1 w-full min-w-0">
              <Legend items={atrasadosLegend} total={data.totalAtrasados} />
            </div>
          </div>
        </ReportCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportCard
          title="Empréstimos por tipo de pessoa"
          subtitle="Empréstimos ativos: alunos, professores e funcionários"
          total={formatTotal(data.totalPorTipoPessoa)}
          totalLabel="ativos"
          loading={isLoading}
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <DonutChart
              data={tipoSlices}
              centerTop={isLoading ? '—' : formatTotal(data.totalPorTipoPessoa)}
              centerBottom="ativos"
            />
            <div className="flex-1 w-full min-w-0">
              <Legend items={tipoLegend} total={data.totalPorTipoPessoa} />
            </div>
          </div>
        </ReportCard>

        <ReportCard
          title="Empréstimos nos últimos 30 dias"
          subtitle="Total de empréstimos registrados por dia"
          total={formatTotal(data.totalUltimos30Dias)}
          totalLabel="em 30 dias"
          loading={isLoading}
        >
          <LineChart data={lineData} color={REPORT_COLORS.linha} />
        </ReportCard>
      </div>
    </div>
  );
}
