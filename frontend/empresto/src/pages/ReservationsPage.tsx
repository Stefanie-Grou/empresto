import { useState, useMemo } from 'react';
import ItemsActionBarHeader from '../components/ItemsActionBarHeader';
import { MOCK_LOANS } from '../mocks/mock_loans';
import { usePaginatedSearch } from '../components/PaginatedSearch';
import ReservationsTable from '../components/ReservationsTable';
import { toLentItem } from '../utils/adapters';
import type { LentItem } from '../interfaces/LentItem';
import GenericFilterDropdown from '../components/GenericFilterDopdown';
import CreateReservationModal, { type CreateReservationFormData } from '../components/modals/CreateReservationModal';
import { inventoryService } from '../services/inventoryService';
import { type WaitlistPayload } from '../interfaces/WaitlistPayload';

export interface ReservationFilterState {
  turma: string;
  ordenacao: string;
}

export default function ReservationPage() {
  const lentItems = useMemo(() => MOCK_LOANS.map(toLentItem), []);

  // Estados de controle dos Modais e Filtros
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<ReservationFilterState>({
    turma: 'todas',
    ordenacao: 'aluno_asc',
  });

const handleSaveReservation = async (formData: CreateReservationFormData) => {
  try {
    await inventoryService.addToWaitlist(formData.acervoId, {
      nomeAluno: formData.userName,
      serie: formData.classGroup,
    });

    setIsCreateModalOpen(false);
  } catch (error) {
    console.error('Erro ao registrar reserva:', error);
    alert('Ocorreu um erro ao tentar salvar a reserva.');
  }
};

  // Extração dinâmica das turmas
  const classOptions = useMemo<FilterOption[]>(() => {
    const rawClasses = lentItems.map((item) => item.studentClass).filter(Boolean);
    const uniqueClasses = Array.from(new Set(rawClasses)).sort((a, b) => a.localeCompare(b));

    const dynamicOptions = uniqueClasses.map((turma) => ({
      label: turma,
      value: turma,
    }));

    return [{ label: 'Todas as turmas', value: 'todas' }, ...dynamicOptions];
  }, [lentItems]);

  // Configuração dos campos do filtro
  const filterFields = useMemo<FieldConfig<ReservationFilterState>[]>(() => [
    {
      key: 'turma',
      label: 'Turma do Aluno',
      type: 'select',
      options: classOptions,
    },
    {
      key: 'ordenacao',
      label: 'Ordenar Por',
      type: 'select',
      options: [
        { label: 'Nome do Aluno (A-Z)', value: 'aluno_asc' },
        { label: 'Título do Livro (A-Z)', value: 'livro_asc' },
      ],
    },
  ], [classOptions]);

  // Aplicação da lógica de filtro e ordenação
  const filteredReservations = useMemo(() => {
    return lentItems
      .filter((item) => {
        if (filters.turma !== 'todas' && item.studentClass !== filters.turma) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (filters.ordenacao === 'aluno_asc') {
          return a.studentName.localeCompare(b.studentName);
        }
        if (filters.ordenacao === 'livro_asc') {
          return a.bookTitle.localeCompare(b.bookTitle);
        }
        return 0;
      });
  }, [lentItems, filters]);

  // Busca e Paginação
  const {
    searchTerm,
    currentPage,
    totalPages,
    paginatedItems,
    handleSearchChange,
    setCurrentPage,
  } = usePaginatedSearch<LentItem>({
    items: filteredReservations,
    searchPredicate: (item, term) =>
      item.bookTitle.toLowerCase().includes(term) ||
      item.bookAuthor.toLowerCase().includes(term) ||
      item.studentName.toLowerCase().includes(term) ||
      item.studentClass.toLowerCase().includes(term) ||
      String(item.id).toLowerCase().includes(term),
  });

  return (
    <div className="flex flex-col gap-6 p-8 relative">
      {/* Barra de Ações conectada ao acionamento do modal de reservas */}
      <ItemsActionBarHeader
        title="Reservas"
        subtitle="Gerencie a ordem de alunos aguardando por livros que estão emprestados no momento."
        placeholder="Buscar reservas ativas"
        newItemLabel="Adicionar à Fila"
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onNewItemClick={() => setIsCreateModalOpen(true)}
        onFilterClick={() => setIsFilterOpen((prev) => !prev)}
      />

      {/* Popover/Modal do Filtro */}
      <GenericFilterDropdown
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filtrar Reservas"
        fields={filterFields}
        filterState={filters}
        onChange={setFilters}
      />

      {/* Tabela de Reservas */}
      <ReservationsTable
        items={paginatedItems}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onEdit={(item) => console.log('Editar:', item)}
        onDelete={(item) => console.log('Excluir:', item)}
      />

      {/* Modal de Criação de Reserva na Fila de Espera */}
      <CreateReservationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveReservation}
      />
    </div>
  );
}