import { useState, useMemo } from 'react';
import ItemsActionBarHeader from '../components/ItemsActionBarHeader';
import ItemsTable from '../components/ItemsTable';
import { MOCK_LOANS } from '../mocks/mock_loans';
import type { InventoryItem } from '../interfaces/InventoryItem';

export default function CollectionPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleOpenModal = () => {
    console.log('Abrir modal de novo empréstimo');
  };

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
      <ItemsActionBarHeader
        title="Gestão de Acervo"
        subtitle="Cadastre, edite e consulte todos os livros, revistas e materiais disponíveis na estante."
        placeholder="Buscar item"
        newItemLabel="Novo item"
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange} 
        onNewItemClick={handleOpenModal}    
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