import { useState, useMemo } from 'react';
import ItemsActionBar from '../components/ItemsActionBar';
import ItemsTable from '../components/ItemsTable';
import { MOCK_LOANS } from '../mocks/mock_loans';
import type { InventoryItem } from '../interfaces/InventoryItem';

export default function CollectionPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredItems: InventoryItem[] = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return MOCK_LOANS
      .filter((item) => {
        if (!term) return true;
        return (
          item.bookTitle.toLowerCase().includes(term) ||
          item.bookAuthor.toLowerCase().includes(term) ||
          String(item.id).toLowerCase().includes(term)
        );
      })
      .map((loan) => ({
        id: loan.id,
        bookTitle: loan.bookTitle,
        bookAuthor: loan.bookAuthor,
        coverUrl: loan.coverUrl,
        itemType: loan.itemType || 'Livro',
        quantity: 1,
        available: 1,
      }));
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;

  const paginatedItems = useMemo(() => {
    return filteredItems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredItems, currentPage, itemsPerPage]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-6 p-8">
      <ItemsActionBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onFilterClick={() => console.log('Abrir modal de filtro')}
        onNewItemClick={() => console.log('Abrir modal de cadastro')}
      />

      <ItemsTable
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