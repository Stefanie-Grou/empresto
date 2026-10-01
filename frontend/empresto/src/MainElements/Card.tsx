import { Icon } from '@iconify/react';

interface StatCardProps {
  title: string;
  subtitle: string;
  value: string | number;
  statsHighlight?: string;
  statsLabel?: string;
  icon: string;
  colorVariable?: string;
}

export default function StatCard({
  title,
  subtitle,
  value,
  statsHighlight,
  statsLabel,
  icon,
  colorVariable = 'var(--color-secondary-light-green)',
}: StatCardProps) {
  const iconName = icon.startsWith('lucide:') ? icon : `lucide:${icon}`;

  return (
    <div style={{ borderColor: `color-mix(in srgb, ${colorVariable} 45%, transparent)` }}
      className="text-medium-gray w-full max-w-xs bg-white-background border rounded-2xl p-5 shadow-sm flex flex-col justify-between font-jakarta">
      <div>
        <h3 className="font-bold text-base leading-tight">
          {title}
        </h3>
        <p className="text-xs mt-1 leading-snug">
          {subtitle}
        </p>
      </div>

      <div className="my-3">
        <span className="text-3xl font-normal tracking-tight">
          {value}
        </span>
      </div>

      <div className="flex items-end justify-between pt-1">
        <div className="text-xs ">
          {statsHighlight && (
            <span style={{ color: colorVariable }} className="font-medium mr-1">
              {statsHighlight}
            </span>
          )}
          {statsLabel && <span>{statsLabel}</span>}
        </div>

        <div style={{ backgroundColor: `${colorVariable}1a`, color: colorVariable }}
          className="rounded-xl flex items-center justify-center">
          <Icon icon={iconName} className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}