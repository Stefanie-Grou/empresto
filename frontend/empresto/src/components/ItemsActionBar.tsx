import { Icon } from '@iconify/react';

interface ItemsActionBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onFilterClick?: () => void;
  onNewItemClick?: () => void;
  placeholder?: string;
}

export default function ItemsActionBar({
  searchTerm,
  onSearchChange,
  onFilterClick,
  onNewItemClick,
  placeholder = 'Buscar itens',
}: ItemsActionBarProps) {
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="relative flex-1">
        <Icon
          icon="lucide:search"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-100/80 hover:bg-gray-100 focus:bg-white border border-transparent focus:border-emerald-600 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none transition-all"
        />
      </div>

      <button
        type="button"
        onClick={onFilterClick}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-emerald-800/30 text-emerald-800 hover:bg-emerald-50/50 rounded-xl text-sm font-medium transition-colors cursor-pointer shrink-0"
      >
        <Icon icon="lucide:funnel" className="w-4 h-4" />
        <span>Filtro</span>
      </button>

      <button
        type="button"
        onClick={onNewItemClick}
        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer shrink-0"
      >
        <Icon icon="lucide:plus" className="w-4 h-4" />
        <span>Novo item</span>
      </button>
    </div>
  );
}