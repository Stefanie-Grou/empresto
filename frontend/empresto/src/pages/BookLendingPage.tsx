import { useState, useMemo, useEffect, useCallback } from 'react';
import ItemsActionBarHeader from '../components/ItemsActionBarHeader';
import { usePaginatedSearch } from '../components/PaginatedSearch';
import LoansTable from '../components/LoansTable';
import { toLentItem } from '../utils/adapters';
import type { LentItem } from '../interfaces/LentItem';
import LoanModal from '../components/modals/LoanModal';
import CreateLoanModal from '../components/modals/CreateLoanModal';
import { loanService } from '../services/loanService';
import GenericFilterDropdown, {
  type FieldConfig,
} from '../components/GenericFilterDopdown';

export interface LoanFilterState {
  // Lista de status selecionados (seleção múltipla, via checkboxes)
  status: string[];
  periodo: string;
  ordenacao: string;
}

// Por padrão mostramos apenas o que ainda está em aberto
const DEFAULT_STATUSES = ['pendente', 'atrasado'];

const LOAN_FILTER_FIELDS: FieldConfig<LoanFilterState>[] = [
  {
    key: 'status',
    label: 'Status do Empréstimo',
    type: 'checkbox-group',
    defaultValues: DEFAULT_STATUSES,
    options: [
      { label: 'Pendente', value: 'pendente' },
      { label: 'Atrasado', value: 'atrasado' },
      { label: 'Devolvido', value: 'devolvido' },
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
      { label: 'Nome (A-Z)', value: 'nome_asc' },
    ],
  },
];

export default function BookLendingPage() {
  const [loans, setLoans] = useState<LentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<LoanFilterState>({
    status: DEFAULT_STATUSES,
    periodo: 'todos',
    ordenacao: 'prazo_asc',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<LentItem | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'cancel'>('view');

  const loadLoans = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await loanService.getAll();
      setLoans(data.map((loan) => toLentItem(loan as Parameters<typeof toLentItem>[0])));
    } catch {
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLoans();
  }, [loadLoans]);

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

    return loans
      .filter((item) => {
        // Filtro de status com seleção múltipla; lista vazia = todos
        const selectedStatuses =
          filters.status.length > 0 ? filters.status : DEFAULT_STATUSES;
        const itemStatus = item.status.toLowerCase().trim();

        if (selectedStatuses.length > 0 && !selectedStatuses.includes(itemStatus)) return false;

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
        if (filters.ordenacao === 'nome_asc') {
          return a.studentName.localeCompare(b.studentName);
        }

        const dateA = parseDueDate(a.dueDate).getTime();
        const dateB = parseDueDate(b.dueDate).getTime();

        if (filters.ordenacao === 'prazo_asc') {
          return dateA - dateB;
        }

        if (filters.ordenacao === 'prazo_desc') {
          return dateB - dateA;
        }

        return 0;
      });
  }, [loans, filters]);

  const searchPredicate = useCallback(
    (item: LentItem, term: string) =>
      item.bookTitle.toLowerCase().includes(term) ||
      item.bookAuthor.toLowerCase().includes(term) ||
      item.studentName.toLowerCase().includes(term) ||
      (item.personType && item.personType.toLowerCase().includes(term)) ||
      (item.studentClass && item.studentClass.toLowerCase().includes(term)) ||
      String(item.id).toLowerCase().includes(term),
    []
  );

  const {
    searchTerm,
    currentPage,
    totalPages,
    paginatedItems,
    handleSearchChange,
    setCurrentPage,
  } = usePaginatedSearch<LentItem>({
    items: filteredLentItems,
    searchPredicate,
  });

  return (
    <div className="flex flex-col gap-6 p-8 relative">
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

      <GenericFilterDropdown
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filtrar Empréstimos"
        fields={LOAN_FILTER_FIELDS}
        filterState={filters}
        onChange={(newFilters) => setFilters(newFilters)}
      />

      <LoansTable
        items={paginatedItems}
        isLoading={isLoading}
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
      />

      <LoanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={async (data) => {
          if (modalMode === 'cancel') await loanService.delete(data.id);
          else if (modalMode === 'edit') await loanService.update(data.id, data);
          setIsModalOpen(false);
          await loadLoans();
        }}
        onRenew={async (data) => {
          await loanService.renew(data.id, data);
          setIsModalOpen(false);
          await loadLoans();
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
        onSave={async (formData) => {
          await loanService.create({
            acervoId: formData.acervoId,
            studentName: formData.studentName,
            studentClass: formData.studentClass,
            personType: formData.personType,
            dueDate: formData.dueDate,
          });
          setIsCreateModalOpen(false);
          await loadLoans();
        }}
      />
    </div>
  );
}
