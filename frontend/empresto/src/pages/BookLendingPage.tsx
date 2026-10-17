import { useState, useMemo, useEffect } from 'react';
import { Icon } from '@iconify/react';
import ItemsActionBarHeader from '../components/ItemsActionBarHeader';
import LoansTable from '../components/LoansTable';
import LoanModal, { type LoanModalData } from '../components/LoanModal';
import { loanService } from '../services/loanService';
import { inventoryService } from '../services/inventoryService';
import type { LentItem } from '../interfaces/LentItem';
import type { InventoryItem } from '../interfaces/InventoryItem';
import Toast, { type ToastType } from '../components/Toast';

interface ToastState {
  id: number;
  type: ToastType;
  title: string;
  message: string;
}

interface FilterState {
  status: 'all' | 'Pendente' | 'Atrasado' | 'Devolvido';
  studentClass: string;
  sortBy: 'dueDate_asc' | 'dueDate_desc' | 'student_asc' | 'book_asc';
}

const defaultFilters: FilterState = {
  status: 'all',
  studentClass: 'all',
  sortBy: 'dueDate_asc',
};

export default function BookLendingPage() {
  const [loans, setLoans] = useState<LentItem[]>([]);
  const [books, setBooks] = useState<InventoryItem[]>([]);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<LentItem | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'delete'>('create');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const itemsPerPage = 5;

  const loadData = async () => {
    try {
      const [loansData, booksData] = await Promise.all([
        loanService.getAll(),
        inventoryService.getAll(),
      ]);
      setLoans(loansData);
      setBooks(booksData);
    } catch (error: any) {
      setToast({
        id: Date.now(),
        type: 'error',
        title: 'Erro ao carregar dados',
        message: error.message || 'Não foi possível carregar os empréstimos.',
      });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const availableClasses = useMemo(() => {
    const classesSet = new Set<string>();
    loans.forEach((item) => {
      if (item.studentClass && item.studentClass.trim() && item.studentClass !== '-') {
        classesSet.add(item.studentClass.trim());
      }
    });
    return Array.from(classesSet).sort();
  }, [loans]);

  const isFilterActive =
    filters.status !== 'all' ||
    filters.studentClass !== 'all' ||
    filters.sortBy !== 'dueDate_asc';

  const filterCount =
    (filters.status !== 'all' ? 1 : 0) +
    (filters.studentClass !== 'all' ? 1 : 0) +
    (filters.sortBy !== 'dueDate_asc' ? 1 : 0);

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    setCurrentPage(1);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLoan(null);
  };

  const handleOpenCreateModal = () => {
    setSelectedLoan(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: LentItem) => {
    setSelectedLoan({ ...item });
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (item: LentItem) => {
    setSelectedLoan({ ...item });
    setModalMode('delete');
    setIsModalOpen(true);
  };

  const handleSaveLoan = async (data: LoanModalData) => {
    try {
      if (modalMode === 'delete' && selectedLoan) {
        await loanService.delete(selectedLoan.id);
        setToast({
          id: Date.now(),
          type: 'success',
          title: 'Empréstimo removido',
          message: 'O registro de empréstimo foi excluído com sucesso.',
        });
      } else if (modalMode === 'edit' && selectedLoan) {
        await loanService.update(selectedLoan.id, {
          nomeAluno: data.studentName,
          turma: data.studentClass,
          livroId: data.bookId,
          prazoDevolucao: data.dueDate,
          status: data.status,
        });
        setToast({
          id: Date.now(),
          type: 'success',
          title: 'Empréstimo atualizado',
          message: 'As alterações do empréstimo foram salvas com sucesso.',
        });
      } else {
        await loanService.create({
          nomeAluno: data.studentName,
          turma: data.studentClass,
          livroId: data.bookId,
          prazoDevolucao: data.dueDate,
        });
        setToast({
          id: Date.now(),
          type: 'success',
          title: 'Empréstimo registrado',
          message: 'Novo empréstimo cadastrado com sucesso!',
        });
      }
      setIsModalOpen(false);
      setSelectedLoan(null);
      await loadData();
    } catch (error: any) {
      setToast({
        id: Date.now(),
        type: 'error',
        title: modalMode === 'delete' ? 'Erro ao remover' : modalMode === 'edit' ? 'Erro ao atualizar' : 'Erro ao cadastrar',
        message: error.message || 'Ocorreu um erro ao processar a solicitação.',
      });
    }
  };

  const handleRenewLoan = async (item: LentItem) => {
    try {
      const res = await loanService.renew(item.id);
      setToast({
        id: Date.now(),
        type: 'success',
        title: 'Empréstimo renovado',
        message: res.mensagem || 'Prazo prorrogado em 7 dias com sucesso.',
      });
      setIsModalOpen(false);
      setSelectedLoan(null);
      await loadData();
    } catch (error: any) {
      setToast({
        id: Date.now(),
        type: 'error',
        title: 'Erro ao renovar',
        message: error.message || 'Não foi possível renovar o empréstimo.',
      });
      setIsModalOpen(false);
      setSelectedLoan(null);
    }
  };


  const filteredItems: LentItem[] = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    let result = loans.filter((item) => {
      const matchesSearch =
        !term ||
        item.bookTitle.toLowerCase().includes(term) ||
        item.bookAuthor.toLowerCase().includes(term) ||
        item.studentName.toLowerCase().includes(term) ||
        (item.studentClass && item.studentClass.toLowerCase().includes(term)) ||
        String(item.id).toLowerCase().includes(term);

      const matchesStatus =
        filters.status === 'all' ||
        item.status.toLowerCase() === filters.status.toLowerCase();

      const matchesClass =
        filters.studentClass === 'all' ||
        (item.studentClass && item.studentClass.toLowerCase() === filters.studentClass.toLowerCase());

      return matchesSearch && matchesStatus && matchesClass;
    });

    result = [...result].sort((a, b) => {
      if (filters.sortBy === 'student_asc') return a.studentName.localeCompare(b.studentName);
      if (filters.sortBy === 'book_asc') return a.bookTitle.localeCompare(b.bookTitle);
      if (filters.sortBy === 'dueDate_desc') {
        const dateA = (a as any).rawDueDate || a.dueDate;
        const dateB = (b as any).rawDueDate || b.dueDate;
        return String(dateB).localeCompare(String(dateA));
      }
      const dateA = (a as any).rawDueDate || a.dueDate;
      const dateB = (b as any).rawDueDate || b.dueDate;
      return String(dateA).localeCompare(String(dateB));
    });

    return result;
  }, [loans, searchTerm, filters]);

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
            <span className="text-sm font-semibold text-gray-900 font-jakarta">Filtrar Empréstimos</span>
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
              Status
            </label>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-gray-100/70 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setFilters((prev) => ({ ...prev, status: 'all' }));
                  setCurrentPage(1);
                }}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  filters.status === 'all'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => {
                  setFilters((prev) => ({ ...prev, status: 'Pendente' }));
                  setCurrentPage(1);
                }}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  filters.status === 'Pendente'
                    ? 'bg-white text-amber-700 font-semibold shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Pendentes
              </button>
              <button
                type="button"
                onClick={() => {
                  setFilters((prev) => ({ ...prev, status: 'Atrasado' }));
                  setCurrentPage(1);
                }}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  filters.status === 'Atrasado'
                    ? 'bg-white text-red-700 font-semibold shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Atrasados
              </button>
              <button
                type="button"
                onClick={() => {
                  setFilters((prev) => ({ ...prev, status: 'Devolvido' }));
                  setCurrentPage(1);
                }}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  filters.status === 'Devolvido'
                    ? 'bg-white text-emerald-800 font-semibold shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Devolvidos
              </button>
            </div>
          </div>

          {availableClasses.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">
                Turma
              </label>
              <div className="relative">
                <select
                  value={filters.studentClass}
                  onChange={(e) => {
                    setFilters((prev) => ({ ...prev, studentClass: e.target.value }));
                    setCurrentPage(1);
                  }}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 outline-none pr-8 focus:bg-white focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 cursor-pointer appearance-none transition-all"
                >
                  <option value="all">Todas as turmas</option>
                  {availableClasses.map((c) => (
                    <option key={c} value={c}>
                      Turma {c}
                    </option>
                  ))}
                </select>
                <Icon
                  icon="lucide:chevron-down"
                  className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                />
              </div>
            </div>
          )}

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
                <option value="dueDate_asc">Prazo mais próximo</option>
                <option value="dueDate_desc">Prazo mais distante</option>
                <option value="student_asc">Aluno (A - Z)</option>
                <option value="book_asc">Livro (A - Z)</option>
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
        title="Gestão de Empréstimos"
        subtitle="Registre saídas, dê baixa nas devoluções e acompanhe quem está com cada item."
        placeholder="Buscar empréstimos"
        newItemLabel="Novo empréstimo"
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onNewItemClick={handleOpenCreateModal}
        onFilterClick={() => setIsFilterOpen((prev) => !prev)}
        filterDropdown={filterDropdown}
        isFilterActive={isFilterActive}
        filterCount={filterCount}
      />

      <LoansTable
        items={paginatedItems}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onEdit={handleOpenEditModal}
        onRenew={handleRenewLoan}
        onDelete={handleOpenDeleteModal}
      />

      <LoanModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveLoan}
        onRenew={handleRenewLoan}
        initialData={selectedLoan}
        mode={modalMode}
        books={books}
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