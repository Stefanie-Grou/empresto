import { useState, useMemo } from 'react';
import ItemsActionBarHeader from '../components/ItemsActionBarHeader';
import { MOCK_LOANS } from '../mocks/mock_loans';
import { usePaginatedSearch } from '../components/PaginatedSearch';
import ReservationsTable from '../components/ReservationsTable';
import { toLentItem } from '../utils/adapters';
import type { LentItem } from '../interfaces/LentItem';
import GenericFilterDropdown, { type FieldConfig, type FilterOption } from '../components/GenericFilterDopdown';

export interface ReservationFilterState {
  turma: string;      // 'todas' | '7A' | '7B' | etc.
  ordenacao: string;  // 'aluno_asc' | 'livro_asc'
}

export default function ReservationPage() {
  const lentItems = useMemo(() => MOCK_LOANS.map(toLentItem), []);

  const classOptions = useMemo<FilterOption[]>(() => {
    const rawClasses = lentItems.map((item) => item.studentClass).filter(Boolean);
    
    // Remove duplicados e ordena alfabeticamente
    const uniqueClasses = Array.from(new Set(rawClasses)).sort((a, b) => a.localeCompare(b));

    // Mapeia para o formato de opções { label, value }
    const dynamicOptions = uniqueClasses.map((turma) => ({
      label: turma,
      value: turma,
    }));

    return [{ label: 'Todas as turmas', value: 'todas' }, ...dynamicOptions];
  }, [lentItems]);

  // 2. Configuração dos campos usando a lista dinâmica de turmas
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

  // Controladores do Filtro
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<ReservationFilterState>({
    turma: 'todas',
    ordenacao: 'aluno_asc',
  });

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
      <ItemsActionBarHeader
        title="Reservas"
        subtitle="Gerencie a ordem de alunos aguardando por livros que estão emprestados no momento."
        placeholder="Buscar reservas ativas"
        newItemLabel="Adicionar à Fila"
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onNewItemClick={() => console.log('Novo item')}
        onFilterClick={() => setIsFilterOpen((prev) => !prev)}
      />

      {/* Passa as opções dinâmicas via `fields={filterFields}` */}
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
        onEdit={(item) => console.log('Editar:', item)}
        onDelete={(item) => console.log('Excluir:', item)}
      />
    </div>
  );
}