import { Icon } from '@iconify/react';

export interface FilterOption {
  label: string;
  value: string;
}

export type FilterFieldType = 'select' | 'segmented';

export interface FieldConfig<T> {
  key: keyof T;
  label: string;
  type: FilterFieldType;
  options: FilterOption[];
}

interface GenericFilterProps<T> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  fields: FieldConfig<T>[];
  filterState: T;
  onChange: (newState: T) => void;
}

export default function GenericFilterDropdown<T>({
  isOpen,
  onClose,
  title = 'Filtrar',
  fields,
  filterState,
  onChange,
}: GenericFilterProps<T>) {
  if (!isOpen) return null;

  const handleFieldChange = (key: keyof T, value: string) => {
    onChange({
      ...filterState,
      [key]: value,
    });
  };

  return (
    <div className="relative">
      {/* Popover / Card do Filtro */}
      <div className="absolute right-0 top-2 w-80 bg-white rounded-3xl shadow-xl border border-gray-100 p-6 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-5">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between text-emerald-950 font-semibold text-base border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <Icon icon="lucide:sliders-horizontal" className="w-5 h-5 text-emerald-800" />
            <span>{title}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <Icon icon="lucide:x" className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {fields.map((field) => {
            const currentValue = String(filterState[field.key] || '');

            return (
              <div key={String(field.key)} className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {field.label}
                </label>

                {/* Select / Dropdown */}
                {field.type === 'select' && (
                  <div className="relative">
                    <select
                      value={currentValue}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-gray-800 appearance-none outline-none focus:border-emerald-700 cursor-pointer"
                    >
                      {field.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <Icon
                      icon="lucide:chevron-down"
                      className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                    />
                  </div>
                )}

                {/* Segmented Button */}
                {field.type === 'segmented' && (
                  <div className="flex bg-gray-100 p-1 rounded-2xl gap-1">
                    {field.options.map((opt) => {
                      const isSelected = currentValue === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleFieldChange(field.key, opt.value)}
                          className={`flex-1 py-1.5 text-xs font-medium rounded-xl transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-white text-gray-900 shadow-xs'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Botão Concluir/Fechar */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 bg-emerald-950 hover:bg-emerald-900 text-white font-medium text-sm rounded-2xl transition-colors cursor-pointer"
        >
          Aplicar Filtros
        </button>
      </div>
    </div>
  );
}