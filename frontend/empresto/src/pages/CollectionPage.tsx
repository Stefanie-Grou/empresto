import { useState, useMemo, useEffect } from 'react';
import { Icon } from '@iconify/react';
import ItemsActionBarHeader from '../components/ItemsActionBarHeader';
import ItemsTable from '../components/ItemsTable';
import type { InventoryItem } from '../interfaces/InventoryItem';
import ItemModal from '../components/modals/ItemModal';
import { inventoryService } from '../services/inventoryService';
import Toast, { type ToastType } from '../components/Toast';

interface ToastState {
  id: number;
  type: ToastType;
  title: string;
  message: string;
}

interface FilterState {
  type: string;
  availability: 'all' | 'available' | 'unavailable';
  sortBy: 'id_asc' | 'id_desc' | 'title_asc' | 'title_desc' | 'available_desc';
}

const defaultFilters: FilterState = {
  type: 'all',
  availability: 'all',
  sortBy: 'id_asc',
};

export default function CollectionPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'delete'>('create');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const itemsPerPage = 5;

  const loadItems = async () => {
    setIsLoading(true);
    try {
      const data = await inventoryService.getAll();
      setItems(data);
    } catch (error: any) {
      setToast({
        id: Date.now(),
        type: 'error',
        title: 'Erro ao carregar acervo',
        message: 'Não foi possível carregar os itens do acervo.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const availableTypes = useMemo(() => {
    const typesSet = new Set<string>();
    items.forEach((item) => {
      if (item.itemType && item.itemType.trim()) {
        typesSet.add(item.itemType.trim());
      }
    });
    return Array.from(typesSet).sort();
  }, [items]);

  const isFilterActive =
    filters.type !== 'all' ||
    filters.availability !== 'all' ||
    filters.sortBy !== 'id_asc';

  const filterCount =
    (filters.type !== 'all' ? 1 : 0) +
    (filters.availability !== 'all' ? 1 : 0) +
    (filters.sortBy !== 'id_asc' ? 1 : 0);

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    setCurrentPage(1);
  };

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

    let result = items.filter((item) => {
      const matchesSearch =
        !term ||
        item.bookTitle.toLowerCase().includes(term) ||
        item.bookAuthor.toLowerCase().includes(term) ||
        (item.itemType && item.itemType.toLowerCase().includes(term)) ||
        String(item.id).toLowerCase().includes(term);

      const matchesType =
        filters.type === 'all' ||
        (item.itemType && item.itemType.toLowerCase() === filters.type.toLowerCase());

      const matchesAvailability =
        filters.availability === 'all' ||
        (filters.availability === 'available' && item.available > 0) ||
        (filters.availability === 'unavailable' && item.available === 0);

      return matchesSearch && matchesType && matchesAvailability;
    });

    result = [...result].sort((a, b) => {
      if (filters.sortBy === 'id_desc') return Number(b.id) - Number(a.id);
      if (filters.sortBy === 'title_asc') return a.bookTitle.localeCompare(b.bookTitle);
      if (filters.sortBy === 'title_desc') return b.bookTitle.localeCompare(a.bookTitle);
      if (filters.sortBy === 'available_desc') return b.available - a.available;
      return Number(a.id) - Number(b.id);
    });

    return result;
  }, [items, searchTerm, filters]);

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

  const filterDropdown = isFilterOpen ? (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={() => setIsFilterOpen(false)}
      />
      <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl shadow-gray-200/80 border border-gray-100 p-5 z-50 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Icon icon="lucide:sliders-horizontal" className="w-4 h-4 text-emerald-800" />
            <span className="text-sm font-semibold text-gray-900 font-jakarta">Filtrar Acervo</span>
          </div>
          {isFilterActive && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs font-medium text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer"
            >
              Limpar tudo
            </button>
          )}
        </div>

        <div className="space-y-4 pt-3.5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">
              Tipo / Gênero
            </label>
            <div className="relative">
              <select
                value={filters.type}
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, type: e.target.value }));
                  setCurrentPage(1);
                }}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 outline-none pr-8 focus:bg-white focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 cursor-pointer appearance-none transition-all"
              >
                <option value="all">Todos os tipos</option>
                {availableTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <Icon
                icon="lucide:chevron-down"
                className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">
              Disponibilidade
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100/70 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setFilters((prev) => ({ ...prev, availability: 'all' }));
                  setCurrentPage(1);
                }}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  filters.availability === 'all'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => {
                  setFilters((prev) => ({ ...prev, availability: 'available' }));
                  setCurrentPage(1);
                }}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  filters.availability === 'available'
                    ? 'bg-white text-emerald-800 font-semibold shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Disponíveis
              </button>
              <button
                type="button"
                onClick={() => {
                  setFilters((prev) => ({ ...prev, availability: 'unavailable' }));
                  setCurrentPage(1);
                }}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  filters.availability === 'unavailable'
                    ? 'bg-white text-red-700 font-semibold shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Esgotados
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">
              Ordenar por
            </label>
            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }));
                  setCurrentPage(1);
                }}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 outline-none pr-8 focus:bg-white focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 cursor-pointer appearance-none transition-all"
              >
                <option value="id_asc">Código (crescente)</option>
                <option value="id_desc">Código (decrescente)</option>
                <option value="title_asc">Título (A - Z)</option>
                <option value="title_desc">Título (Z - A)</option>
                <option value="available_desc">Mais exemplares disponíveis</option>
              </select>
              <Icon
                icon="lucide:chevron-down"
                className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 mt-3 border-t border-gray-100 flex items-center justify-end">
          <button
            type="button"
            onClick={() => setIsFilterOpen(false)}
            className="w-full py-2 bg-emerald-900 hover:bg-emerald-950 text-white font-medium text-xs rounded-xl transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </>
  ) : null;

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
        onFilterClick={() => setIsFilterOpen((prev) => !prev)}
        filterDropdown={filterDropdown}
        isFilterActive={isFilterActive}
        filterCount={filterCount}
      />

      <ItemsTable
        items={paginatedItems}
        isLoading={isLoading}
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