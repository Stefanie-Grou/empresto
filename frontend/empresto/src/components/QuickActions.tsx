import { Icon } from '@iconify/react';

interface ActionItem {
    id: string;
    label: string;
    icon: string;
    onClick?: () => void;
}

const DEFAULT_ACTIONS: ActionItem[] = [
    {
        id: '1',
        label: 'Cadastrar exemplar',
        icon: 'lucide:book-plus',
    },
    {
        id: '2',
        label: 'Consultar exemplar',
        icon: 'lucide:book-search',
    },
];

interface QuickActionsProps {
    actions?: ActionItem[];
}

export default function QuickActions({ actions = DEFAULT_ACTIONS }: QuickActionsProps) {
    return (
        <div className="border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="div-title">
                Ações
            </h2>

            <div className="grid grid-cols-2">
                {actions.map((action) => (
                    <button
                        key={action.id}
                        onClick={action.onClick}
                        type="button"
                        className="flex flex-col items-center justify-center p-5 bg-white-background border border-transparent rounded-2xl transition-all cursor-pointer group text-center"
                    >
                        <div className="p-3 bg-white-background rounded-xl text-medium-gray group-hover:text-emerald-700 transition-colors mb-3">
                            <Icon icon={action.icon} className="w-6 h-6" />
                        </div>

                        <span className="text-xs font-medium text-medium-gray group-hover:text-emerald-900 leading-tight">
                            {action.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}