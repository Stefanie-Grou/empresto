import { useMemo } from 'react';
import ItemsActionBarHeader from '../components/ItemsActionBarHeader';
import { MOCK_LOANS } from '../mocks/mock_loans';
import { usePaginatedSearch } from '../components/PaginatedSearch';
import ReservationsTable from '../components/ReservationsTable';
import { toLentItem } from '../utils/adapters';
import type { LentItem } from '../interfaces/LentItem';

export default function ReservationPage() {
  const lentItems = useMemo(() => MOCK_LOANS.map(toLentItem), []);

  const {
    searchTerm,
    currentPage,
    totalPages,
    paginatedItems,
    handleSearchChange,
    setCurrentPage,
  } = usePaginatedSearch<LentItem>({
    items: lentItems, 
    searchPredicate: (item, term) =>
      item.bookTitle.toLowerCase().includes(term) ||
      item.bookAuthor.toLowerCase().includes(term) ||
      item.studentName.toLowerCase().includes(term) ||
      String(item.id).toLowerCase().includes(term),
  });

  const handleOpenModal = () => {
    console.log('Abrir modal de nova entrada na fila de espera');
  };

  return (
    <div className="flex flex-col gap-6 p-8">
      <ItemsActionBarHeader
        title="Reservas"
        subtitle="Gerencie a ordem de alunos aguardando por livros que estão emprestados no momento."
        placeholder="Buscar reservas ativas"
        newItemLabel="Adicionar à Fila"
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange} 
        onNewItemClick={handleOpenModal}    
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