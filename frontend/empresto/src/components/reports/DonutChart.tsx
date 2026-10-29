export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutSlice[];
  size?: number;
  thickness?: number;
  centerTop: string;
  centerBottom: string;
  emptyMessage?: string;
}

function polarToCartesian(cx: number, cy: number, radius: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad),
  };
}

function wedgePath(cx: number, cy: number, radius: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(cx, cy, radius, startAngle);
  const end = polarToCartesian(cx, cy, radius, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  // Fatia integral: dois raios em vez de arco
  if (endAngle - startAngle >= 359.99) {
    const mid = polarToCartesian(cx, cy, radius, startAngle + 180);
    return [
      `M ${cx} ${cy}`,
      `L ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 1 1 ${mid.x} ${mid.y}`,
      `A ${radius} ${radius} 0 1 1 ${start.x} ${start.y}`,
      'Z',
    ].join(' ');
  }

  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`,
    'Z',
  ].join(' ');
}

export default function DonutChart({
  data,
  size = 200,
  thickness = 46,
  centerTop,
  centerBottom,
  emptyMessage = 'Nenhum dado disponível',
}: DonutChartProps) {
  const total = data.reduce((sum, slice) => sum + slice.value, 0);

  if (total <= 0) {
    return (
      <div
        className="flex items-center justify-center rounded-full border border-dashed border-gray-200 text-xs text-gray-400"
        style={{ width: size, height: size }}
      >
        {emptyMessage}
      </div>
    );
  }

  const cx = size / 2;
  const cy = size / 2;
  const outerRadius = size / 2 - 4;
  const innerRadius = outerRadius - thickness;

  const slices = data.filter((slice) => slice.value > 0);
  const wedges = slices.map((slice, index) => {
    const startAngle = slices
      .slice(0, index)
      .reduce((sum, previous) => sum + (previous.value / total) * 360, 0);
    const angle = (slice.value / total) * 360;
    return { ...slice, path: wedgePath(cx, cy, outerRadius, startAngle, startAngle + angle) };
  });

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} role="img" aria-label={centerBottom}>
        {wedges.map((wedge) => (
          <path key={wedge.label} d={wedge.path} fill={wedge.color} />
        ))}
        <circle cx={cx} cy={cy} r={innerRadius} fill="#FAFAFA" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-normal tracking-tight text-full-black font-jakarta">
          {centerTop}
        </span>
        <span className="text-xs text-gray-500 font-jakarta">{centerBottom}</span>
      </div>
    </div>
  );
}
