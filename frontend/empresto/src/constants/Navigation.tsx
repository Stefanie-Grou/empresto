import { useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import DropdownOptions from '../assets/Dropwdown';

const PAGE_HEADER_DATA: Record<string, { label: string; subtitle: string; icon: string }> = {
  '/dashboard': {
    label: 'Visão Geral',
    subtitle: 'Acompanhe o resumo do seu acervo',
    icon: 'lucide:chart-column',
  },
  '/acervo': {
    label: 'Acervo',
    subtitle: 'Consulta de todos os livros da estante.',
    icon: 'lucide:book-search',
  },
  '/emprestimos': {
    label: 'Empréstimos',
    subtitle: 'Controle todos os empréstimos realizados.',
    icon: 'lucide:stamp',
  },
  '/reservas': {
    label: 'Reservas',
    subtitle: 'Controle a fila de espera.',
    icon: 'lucide:calendar-days',
  },
  '/relatorios': {
    label: 'Relatórios',
    subtitle: 'Análise e movimentações do período.',
    icon: 'lucide:clipboard-plus',
  },
};

export default function HeaderElement() {
  const location = useLocation();

  const currentPage = PAGE_HEADER_DATA[location.pathname] || {
    label: 'Acervo',
    subtitle: 'Consulta de todos os livros da estante.',
    icon: 'lucide:book-search',
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center font-inter">
      <div className="flex items-center gap-4">
        <div className="text-main-background-green flex items-center justify-center">
          <Icon icon={currentPage.icon} className="w-8 h-8" />
        </div>

        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-gray-900 leading-snug">
            {currentPage.label}
          </h1>
          <p className="text-xs text-gray-500 leading-snug">
            {currentPage.subtitle}
          </p>
        </div>
      </div>

      {/* Direita: Componente do Usuário com Dropdown */}
      <DropdownOptions userName="Ana Carolina" userRole="Bibliotecária" />
    </header>
  );
}