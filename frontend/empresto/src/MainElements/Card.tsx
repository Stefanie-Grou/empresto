import { Icon } from '@iconify/react';

interface StatCardProps {
  title: string;
  subtitle: string;
  value: string | number;
  statsHighlight?: string; 
  statsLabel?: string;     
  icon: string;            
}

export default function StatCard({
  title,
  subtitle,
  value,
  statsHighlight,
  statsLabel,
  icon,
}: StatCardProps) {
  const iconName = icon.startsWith('lucide:') ? icon : `lucide:${icon}`;

  return (
    <div className="text-medium-gray w-full max-w-xs bg-white border border-secondary-light-green/30 rounded-2xl p-5 shadow-xs flex flex-col justify-between font-jakarta">
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
            <span className="text-emerald-400 font-medium mr-1">
              {statsHighlight}
            </span>
          )}
          {statsLabel && <span>{statsLabel}</span>}
        </div>

        <div className="rounded-xl text-emerald-400 flex items-center justify-center">
          <Icon icon={iconName} className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}