import { useState, useMemo } from 'react';
import ItemsActionBarHeader from '../components/ItemsActionBarHeader';
import ItemsTable from '../components/ItemsTable';
import { MOCK_LOANS } from '../mocks/mock_loans';
import type { InventoryItem } from '../interfaces/InventoryItem';
import ItemModal from '../components/modals/ItemModal';
import { inventoryService } from '../services/inventoryService';

export default function CollectionPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'delete'>('create');

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // *** HANDLERS DOS MODAIS ***
  // POST
  const handleOpenCreateModal = () => {
    setSelectedItem(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  // PUT
  const handleOpenEditModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  // DELETE 
  const handleOpenDeleteModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setModalMode('delete');
    setIsModalOpen(true);
  };

  const handleSaveItem = async (data: Omit<InventoryItem, 'id' | 'available'>) => {
    try {
      if (modalMode === 'delete' && selectedItem) {
        await inventoryService.delete(selectedItem.id);
        console.log('Item excluído via DELETE');
      } else if (modalMode === 'edit' && selectedItem) {
        await inventoryService.update(selectedItem.id, data);
        console.log('Item atualizado via PUT');
      } else {
        await inventoryService.create(data);
        console.log('Item criado via POST');
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao processar ação:', error);
    }
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
        onNewItemClick={handleOpenCreateModal} 
      />

      <ItemsTable
        items={paginatedItems}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteModal} 
      />

      <ItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveItem}
        initialData={selectedItem}
        title={
          modalMode === 'delete'
            ? 'Remover Item do Acervo'
            : modalMode === 'edit'
            ? 'Editar Item do Acervo'
            : 'Cadastrar Item no Acervo'
        }
        isReadOnly={modalMode === 'delete'}
        warningMessage={
          modalMode === 'delete'
            ? 'Confirma a exclusão do acervo de todos os exemplares do item acima?'
            : undefined
        }
        submitLabel={modalMode === 'delete' ? 'Excluir' : 'Salvar'}
      />
    </div>
  );
}