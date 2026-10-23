import { useState, useMemo } from 'react';
import ItemsActionBarHeader from '../components/ItemsActionBarHeader';
import { MOCK_LOANS } from '../mocks/mock_loans';
import { usePaginatedSearch } from '../components/PaginatedSearch';
import LoansTable from '../components/LoansTable';
import { toLentItem } from '../utils/adapters';
import type { LentItem } from '../interfaces/LentItem';
import LoanModal from '../components/modals/LoanModal';
import CreateLoanModal from '../components/modals/CreateLoanModal';
import { loanService } from '../services/loanService';
import GenericFilterDropdown from '../components/GenericFilterDopdown';

export interface LoanFilterState {
  status: string;
  periodo: string;
  ordenacao: string;
}

export type FilterFieldType = 'select' | 'segmented';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FieldConfig<T> {
  key: keyof T;
  label: string;
  type: FilterFieldType;
  options: FilterOption[];
}

const LOAN_FILTER_FIELDS: FieldConfig<LoanFilterState>[] = [
  {
    key: 'status',
    label: 'Status do Empréstimo',
    type: 'segmented',
    options: [
      { label: 'Todos', value: 'todos' },
      { label: 'Em Dia', value: 'em_dia' },
      { label: 'Atrasados', value: 'atrasado' },
    ],
  },
  {
    key: 'periodo',
    label: 'Prazo de Devolução',
    type: 'select',
    options: [
      { label: 'Todos os períodos', value: 'todos' },
      { label: 'Vence Hoje', value: 'hoje' },
      { label: 'Esta Semana', value: 'semana' },
      { label: 'Este Mês', value: 'mes' },
    ],
  },
  {
    key: 'ordenacao',
    label: 'Ordenar Por',
    type: 'select',
    options: [
      { label: 'Data de entrega (crescente)', value: 'prazo_asc' },
      { label: 'Data de entrega (decrescente)', value: 'prazo_desc' },
      { label: 'Nome do Aluno (A-Z)', value: 'nome_asc' },
    ],
  },
];

export default function BookLendingPage() {
  const initialLentItems = useMemo(() => MOCK_LOANS.map(toLentItem), []);

  // Controladores do Filtro
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<LoanFilterState>({
    status: 'todos',
    periodo: 'todos',
    ordenacao: 'prazo_asc',
  });

  // Modais (mudamos 'delete' para 'cancel' para melhor semântica)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<LentItem | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'cancel'>('view');

  // Aplicar Filtro aos itens
  function parseDueDate(dateStr: string): Date {
    if (!dateStr) return new Date(0);
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/').map(Number);
      return new Date(year, month - 1, day);
    }
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  const filteredLentItems = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return initialLentItems
      .filter((item) => {
        // 1. Filtro de Status
        if (filters.status === 'em_dia' && item.status.toLowerCase() !== 'em dia') return false;
        if (filters.status === 'atrasado' && item.status.toLowerCase() !== 'atrasado') return false;

        // 2. Filtro de Período
        if (filters.periodo !== 'todos') {
          const itemDate = parseDueDate(item.dueDate);
          itemDate.setHours(0, 0, 0, 0);

          const diffInDays = Math.ceil((itemDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

          if (filters.periodo === 'hoje' && diffInDays !== 0) return false;
          if (filters.periodo === 'semana' && (diffInDays < 0 || diffInDays > 7)) return false;
          if (filters.periodo === 'mes' && (diffInDays < 0 || diffInDays > 30)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // 3. Ordenação
        if (filters.ordenacao === 'nome_asc') {
          return a.studentName.localeCompare(b.studentName);
        }

        const dateA = parseDueDate(a.dueDate).getTime();
        const dateB = parseDueDate(b.dueDate).getTime();

        if (filters.ordenacao === 'prazo_asc') {
          return dateA - dateB; // Mais próximos do vencimento primeiro
        }

        if (filters.ordenacao === 'prazo_desc') {
          return dateB - dateA; // Mais distantes primeiro
        }

        return 0;
      });
  }, [initialLentItems, filters]);

  // Paginação e Busca
  const {
    searchTerm,
    currentPage,
    totalPages,
    paginatedItems,
    handleSearchChange,
    setCurrentPage,
  } = usePaginatedSearch<LentItem>({
    items: filteredLentItems,
    searchPredicate: (item, term) =>
      item.bookTitle.toLowerCase().includes(term) ||
      item.bookAuthor.toLowerCase().includes(term) ||
      item.studentName.toLowerCase().includes(term) ||
      String(item.id).toLowerCase().includes(term),
  });

  return (
    <div className="flex flex-col gap-6 p-8 relative">
      {/* Barra de Ações com Gatilho do Filtro Existente */}
      <ItemsActionBarHeader
        title="Gestão de Empréstimos"
        subtitle="Registre saídas, dê baixa nas devoluções e acompanhe quem está com cada item."
        placeholder="Buscar empréstimos"
        newItemLabel="Novo empréstimo"
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onNewItemClick={() => setIsCreateModalOpen(true)}
        onFilterClick={() => setIsFilterOpen((prev) => !prev)}
      />

      {/* Popover/Modal do Filtro Renderizado logo abaixo do cabeçalho */}
      <GenericFilterDropdown
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filtrar Empréstimos"
        fields={LOAN_FILTER_FIELDS}
        filterState={filters}
        onChange={setFilters}
      />

      {/* Tabela de Empréstimos */}
      <LoansTable
        items={paginatedItems}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onEdit={(item) => {
          setSelectedLoan(item);
          setModalMode('edit');
          setIsModalOpen(true);
        }}
        onRenew={(item) => {
          setSelectedLoan(item);
          setModalMode('view');
          setIsModalOpen(true);
        }}
        onDelete={(item) => {
          setSelectedLoan(item);
          setModalMode('cancel'); 
          setIsModalOpen(true);
        }}
        onReturn={(item) => loanService.returnLoan(item.id)}
      />

      {/* Modais de Ação */}
      <LoanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => {
          if (modalMode === 'cancel') loanService.delete(data.id);
          else if (modalMode === 'edit') loanService.update(data.id, data);
          setIsModalOpen(false);
        }}
        onRenew={(data) => {
          loanService.renew(data.id, data);
          setIsModalOpen(false);
        }}
        loan={selectedLoan}
        isReadOnly={modalMode !== 'edit'}
        title={
          modalMode === 'cancel'
            ? 'Cancelar Empréstimo'
            : modalMode === 'edit'
            ? 'Editar Empréstimo'
            : 'Visualizar Empréstimo'
        }
        warningMessage={
          modalMode === 'cancel'
            ? 'Tem certeza de que deseja finalizar este empréstimo?'
            : undefined
        }
        submitLabel={modalMode === 'cancel' ? 'Devolver' : 'Salvar'}
      />

      <CreateLoanModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={(formData) => {
          loanService.create({
            acervoId: formData.acervoId,
            studentName: formData.studentName,
            studentClass: formData.studentClass,
            dueDate: formData.dueDate,
          });
          setIsCreateModalOpen(false);
        }}
      />
    </div>
  );
}