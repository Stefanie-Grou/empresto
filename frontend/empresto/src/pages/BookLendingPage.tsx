import { useState, useMemo } from 'react';
import ItemsActionBarHeader from '../components/ItemsActionBarHeader';
import { MOCK_LOANS } from '../mocks/mock_loans';
import { usePaginatedSearch } from '../components/PaginatedSearch';
import LoansTable from '../components/LoansTable';
import { toLentItem } from '../utils/adapters';
import type { LentItem } from '../interfaces/LentItem';
import LoanModal from '../components/modals/LoanModal';
import CreateLoanModal, { type CreateLoanFormData } from '../components/modals/CreateLoanModal';
import { loanService } from '../services/loanService';

export default function BookLendingPage() {
  // Dados iniciais
  const initialLentItems = useMemo(() => MOCK_LOANS.map(toLentItem), []);

  // Estados dos Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<LentItem | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'delete'>('view');

  // Busca e Paginação
  const {
    searchTerm,
    currentPage,
    totalPages,
    paginatedItems,
    handleSearchChange,
    setCurrentPage,
  } = usePaginatedSearch<LentItem>({
    items: initialLentItems,
    searchPredicate: (item, term) =>
      item.bookTitle.toLowerCase().includes(term) ||
      item.bookAuthor.toLowerCase().includes(term) ||
      item.studentName.toLowerCase().includes(term) ||
      String(item.id).toLowerCase().includes(term),
  });

  // Handlers para Abertura dos Modais
  const handleOpenEdit = (item: LentItem) => {
    setSelectedLoan(item);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleOpenView = (item: LentItem) => {
    setSelectedLoan(item);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleOpenDelete = (item: LentItem) => {
    setSelectedLoan(item);
    setModalMode('delete');
    setIsModalOpen(true);
  };

  // Handler para Novo Empréstimo (POST /api/v1/emprestimos)
  const handleCreateLoan = async (formData: CreateLoanFormData) => {
    try {
      await loanService.create({
        acervoId: formData.acervoId || 1,
        studentName: formData.studentName,
        studentClass: formData.studentClass,
        dueDate: formData.dueDate,
      });
      console.log('Novo empréstimo registrado com sucesso!');
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Erro ao cadastrar empréstimo:', error);
    }
  };

  // Handler para Salvar Edição ou Confirmar Exclusão
  const handleSaveLoan = async (updatedLoan: LentItem) => {
    try {
      if (modalMode === 'delete') {
        // DELETE /api/v1/emprestimos/{id}
        await loanService.delete(updatedLoan.id);
        console.log(`Empréstimo ${updatedLoan.id} removido com sucesso!`);
      } else if (modalMode === 'edit') {
        // PUT /api/v1/emprestimos/{id}
        await loanService.update(updatedLoan.id, updatedLoan);
        console.log('Empréstimo atualizado com sucesso!');
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao processar ação no empréstimo:', error);
    }
  };

  // Handler para Renovação (+7 dias via PUT)
  const handleRenewLoan = async (loanToRenew: LentItem) => {
    try {
      await loanService.renew(loanToRenew.id, loanToRenew);
      console.log('Empréstimo renovado com sucesso (+7 dias)!');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao renovar empréstimo:', error);
    }
  };

  // Handler para Baixa / Devolução (POST /api/v1/emprestimos/{id}/devolucao sem corpo)
  const handleReturnLoan = async (loanId: string | number) => {
    try {
      await loanService.returnLoan(loanId);
      console.log(`Devolução do empréstimo ${loanId} registrada com sucesso!`);
    } catch (error) {
      console.error('Erro ao dar baixa no empréstimo:', error);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Barra de Ações Superior */}
      <ItemsActionBarHeader
        title="Gestão de Empréstimos"
        subtitle="Registre saídas, dê baixa nas devoluções e acompanhe quem está com cada item."
        placeholder="Buscar empréstimos"
        newItemLabel="Novo empréstimo"
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onNewItemClick={() => setIsCreateModalOpen(true)}
      />

      {/* Tabela de Empréstimos */}
      <LoansTable
        items={paginatedItems}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onEdit={handleOpenEdit}
        onRenew={handleOpenView}
        onDelete={handleOpenDelete}
        onReturn={(item) => handleReturnLoan(item.id)}
      />

      {/* Modal de Detalhes / Edição / Renovação / Exclusão */}
      <LoanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveLoan}
        onRenew={handleRenewLoan}
        loan={selectedLoan}
        title={
          modalMode === 'delete'
            ? 'Remover Empréstimo'
            : modalMode === 'edit'
            ? 'Editar Empréstimo'
            : 'Visualizar Empréstimo'
        }
        isReadOnly={modalMode !== 'edit'}
        warningMessage={
          modalMode === 'delete'
            ? 'Confirma o cancelamento/remoção deste registro de empréstimo?'
            : undefined
        }
        submitLabel={modalMode === 'delete' ? 'Excluir' : 'Salvar'}
      />

      {/* Modal de Cadastro de Novo Empréstimo */}
      <CreateLoanModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateLoan}
      />
    </div>
  );
}