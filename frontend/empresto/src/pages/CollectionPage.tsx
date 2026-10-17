import { useState, useMemo, useEffect } from 'react';
import ItemsActionBarHeader from '../components/ItemsActionBarHeader';
import ItemsTable from '../components/ItemsTable';
import type { InventoryItem } from '../interfaces/InventoryItem';
import ItemModal from '../components/ItemModal';
import { inventoryService } from '../services/inventoryService';
import Toast, { type ToastType } from '../components/Toast';

interface ToastState {
  id: number;
  type: ToastType;
  title: string;
  message: string;
}

export default function CollectionPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'delete'>('create');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const loadItems = async () => {
    try {
      const data = await inventoryService.getAll();
      setItems(data);
    } catch (error: any) {
      setToast({
        id: Date.now(),
        type: 'error',
        title: 'Erro ao carregar acervo',
        message: error.message || 'Não foi possível carregar os itens do acervo.',
      });
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleOpenCreateModal = () => {
    setSelectedItem(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setModalMode('delete');
    setIsModalOpen(true);
  };

  const handleSaveItem = async (data: Omit<InventoryItem, 'id' | 'available'>) => {
    try {
      if (modalMode === 'delete' && selectedItem) {
        await inventoryService.delete(selectedItem.id);
        setToast({
          id: Date.now(),
          type: 'success',
          title: 'Item removido',
          message: 'O exemplar foi removido do acervo com sucesso.',
        });
      } else if (modalMode === 'edit' && selectedItem) {
        await inventoryService.update(selectedItem.id, data);
        setToast({
          id: Date.now(),
          type: 'success',
          title: 'Item atualizado',
          message: 'As alterações do item foram salvas com sucesso.',
        });
      } else {
        await inventoryService.create(data);
        setToast({
          id: Date.now(),
          type: 'success',
          title: 'Item cadastrado',
          message: 'Novo exemplar adicionado ao acervo com sucesso.',
        });
      }
      setIsModalOpen(false);
      await loadItems();
    } catch (error: any) {
      setToast({
        id: Date.now(),
        type: 'error',
        title: modalMode === 'delete' ? 'Erro ao remover' : modalMode === 'edit' ? 'Erro ao atualizar' : 'Erro ao cadastrar',
        message: error.message || 'Ocorreu um erro ao processar a solicitação.',
      });
    }
  };

  const filteredItems: InventoryItem[] = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return items.filter((item) => {
      if (!term) return true;
      return (
        item.bookTitle.toLowerCase().includes(term) ||
        item.bookAuthor.toLowerCase().includes(term) ||
        (item.itemType && item.itemType.toLowerCase().includes(term)) ||
        String(item.id).toLowerCase().includes(term)
      );
    });
  }, [items, searchTerm]);

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

      {toast && (
        <Toast
          key={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}