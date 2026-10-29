interface LinePoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: LinePoint[];
  height?: number;
  color?: string;
  emptyMessage?: string;
}

function formatDayLabel(isoDay: string): string {
  // '2026-09-30' -> '30/09'
  const [year, month, day] = isoDay.split('-');
  if (!year || !month || !day) return isoDay;
  return `${day}/${month}`;
}

function niceMax(value: number): number {
  if (value <= 0) return 1;
  if (value <= 5) return 5;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalized = value / magnitude;
  const nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return nice * magnitude;
}

export default function LineChart({
  data,
  height = 220,
  color = '#0E3D2D',
  emptyMessage = 'Nenhum dado disponível',
}: LineChartProps) {
  const width = 640;
  const paddingLeft = 36;
  const paddingRight = 12;
  const paddingTop = 16;
  const paddingBottom = 30;

  const innerWidth = width - paddingLeft - paddingRight;
  const innerHeight = height - paddingTop - paddingBottom;

  const maxValue = niceMax(Math.max(...data.map((point) => point.value), 0));
  const ticks = [0, maxValue / 2, maxValue];

  if (data.length === 0 || data.every((point) => point.value === 0)) {
    return (
      <div
        className="flex items-center justify-center rounded-2xl border border-dashed border-gray-200 text-xs text-gray-400 w-full"
        style={{ height }}
      >
        {emptyMessage}
      </div>
    );
  }

  const stepX = data.length > 1 ? innerWidth / (data.length - 1) : 0;

  const points = data.map((point, index) => {
    const x = paddingLeft + index * stepX;
    const y = paddingTop + innerHeight - (point.value / maxValue) * innerHeight;
    return { ...point, x, y };
  });

  // Dias sem empréstimo não quebram a linha (interpolação linear)
  const path =
    points.length === 1
      ? `M ${points[0].x - 24} ${points[0].y} L ${points[0].x + 24} ${points[0].y}`
      : points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');

  const labelEvery = Math.max(1, Math.ceil(points.length / 10));

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      style={{ height }}
      role="img"
      aria-label="Empréstimos por mês"
      preserveAspectRatio="none"
    >
      {ticks.map((tick) => {
        const y = paddingTop + innerHeight - (tick / maxValue) * innerHeight;
        return (
          <g key={tick}>
            <line
              x1={paddingLeft}
              x2={width - paddingRight}
              y1={y}
              y2={y}
              stroke="#F3F4F6"
              strokeWidth={1}
            />
            <text x={4} y={y + 4} fontSize={11} fill="#9ca3af" fontFamily="Plus Jakarta Sans, sans-serif">
              {tick >= 1000 ? `${(tick / 1000).toFixed(tick % 1000 === 0 ? 0 : 1)}k` : tick}
            </text>
          </g>
        );
      })}

      <path d={path} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

      {points.map((point, index) => (
        <g key={point.label}>
          <circle cx={point.x} cy={point.y} r={3.5} fill={color} stroke="#FAFAFA" strokeWidth={2}>
            <title>{`${formatDayLabel(point.label)}: ${point.value} ${point.value === 1 ? 'empréstimo' : 'empréstimos'}`}</title>
          </circle>
          {index % labelEvery === 0 && (
            <text
              x={point.x}
              y={height - 8}
              fontSize={11}
              fill="#9ca3af"
              textAnchor="middle"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              {formatDayLabel(point.label)}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
