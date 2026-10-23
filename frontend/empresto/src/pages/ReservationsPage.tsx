import { useState, useMemo } from 'react';
import ItemsActionBarHeader from '../components/ItemsActionBarHeader';
import { MOCK_LOANS } from '../mocks/mock_loans';
import { usePaginatedSearch } from '../components/PaginatedSearch';
import ReservationsTable from '../components/ReservationsTable';
import { toLentItem } from '../utils/adapters';
import type { LentItem } from '../interfaces/LentItem';
import GenericFilterDropdown, { type FieldConfig, type FilterOption } from '../components/GenericFilterDopdown';
import CreateReservationModal, { type CreateReservationFormData } from '../components/modals/CreateReservationModal';
import ReservationModal from '../components/modals/ReservationModal';
import { 
  inventoryService, 
  type RemoveWaitlistPayload, 
} from '../services/inventoryService';
import type { WaitlistPayload } from '../interfaces/WaitlistPayload';

export interface ReservationFilterState {
  turma: string;
  ordenacao: string;
}

export default function ReservationPage() {
  const lentItems = useMemo(() => MOCK_LOANS.map(toLentItem), []);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<LentItem | null>(null);
  const [modalMode, setModalMode] = useState<'edit' | 'delete'>('edit');

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<ReservationFilterState>({
    turma: 'todas',
    ordenacao: 'aluno_asc',
  });

  const handleSaveNewReservation = async (formData: CreateReservationFormData) => {
    try {
      const payload: WaitlistPayload = {
        nomeAluno: formData.userName,
        serie: formData.classGroup,
      };

      await inventoryService.addToWaitlist(formData.acervoId, payload);
      setIsCreateModalOpen(false);
    } catch {
      // O toast de erro é exibido pelo inventoryService
    }
  };

  const handleSaveActionModal = async (data: LentItem) => {
    const acervoId = data.acervoId || data.id;

    if (modalMode === 'delete') {
      try {
        const payload: RemoveWaitlistPayload = {
          nomeAluno: data.studentName,
          serie: data.studentClass,
        };

        await inventoryService.removeFromWaitlist(acervoId, payload);

        setIsActionModalOpen(false);
      } catch {
        // O toast de erro é exibido pelo inventoryService
      }
    } else {
      try {
        const payload: UpdateWaitlistPayload = {
          nomeAluno: data.studentName,
          serie: data.studentClass,
        };

        await inventoryService.updateWaitlist(acervoId, payload);

        setIsActionModalOpen(false);
      } catch {
        // O toast de erro é exibido pelo inventoryService
      }
    }
  };

  const classOptions = useMemo<FilterOption[]>(() => {
    const rawClasses = lentItems.map((item) => item.studentClass).filter(Boolean);
    const uniqueClasses = Array.from(new Set(rawClasses)).sort((a, b) => a.localeCompare(b));

    const dynamicOptions = uniqueClasses.map((turma) => ({
      label: turma,
      value: turma,
    }));

    return [{ label: 'Todas as turmas', value: 'todas' }, ...dynamicOptions];
  }, [lentItems]);

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

      <GenericFilterDropdown
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filtrar Reservas"
        fields={filterFields}
        filterState={filters}
        onChange={setFilters}
      />

      <ReservationsTable
        items={paginatedItems}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onEdit={(item) => {
          setSelectedReservation(item);
          setModalMode('edit');
          setIsActionModalOpen(true);
        }}
        onDelete={(item) => {
          setSelectedReservation(item);
          setModalMode('delete');
          setIsActionModalOpen(true);
        }}
      />

      {/* Modal para Adicionar à Fila */}
      <CreateReservationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveNewReservation}
      />

      {/* Modal Unificado para Edição e Exclusão de Reserva */}
      <ReservationModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        onSave={handleSaveActionModal}
        reservation={selectedReservation}
        isReadOnly={modalMode !== 'edit'}
        title={modalMode === 'delete' ? 'Remover da Fila de Espera' : 'Editar Reserva'}
        warningMessage={
          modalMode === 'delete'
            ? 'Confirma a remoção desta entrada na fila de espera?'
            : undefined
        }
        submitLabel={modalMode === 'delete' ? 'Remover' : 'Salvar Alterações'}
      />
    </div>
  );
}