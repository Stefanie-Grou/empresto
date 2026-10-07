import { useMemo } from 'react';
import ItemsActionBarHeader from '../components/ItemsActionBarHeader';
import { MOCK_LOANS } from '../mocks/mock_loans';
import { usePaginatedSearch } from '../components/PaginatedSearch';
import LoansTable from '../components/LoansTable';
import { toLentItem } from '../utils/adapters';
import type { LentItem } from '../interfaces/LentItem';

export default function BookLendingPage() {
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
      item.studentName.toLowerCase().includes(term) || // 3. Busca também pelo aluno
      String(item.id).toLowerCase().includes(term),
  });

  const handleOpenModal = () => {
    console.log('Abrir modal de novo empréstimo');
  };

  return (
    <div className="flex flex-col gap-6 p-8">
      <ItemsActionBarHeader
        title="Gestão de Empréstimos"
        subtitle="Registre saídas, dê baixa nas devoluções e acompanhe quem está com cada item."
        placeholder="Buscar empréstimos"
        newItemLabel="Novo empréstimo"
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange} 
        onNewItemClick={handleOpenModal}    
      />

      <LoansTable
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