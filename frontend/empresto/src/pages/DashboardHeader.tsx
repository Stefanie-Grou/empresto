import { useState } from 'react';
import { Icon } from '@iconify/react';
import CreateLoanModal, { type CreateLoanFormData } from '../components/modals/CreateLoanModal';
import { loanService } from '../services/loanService';

export default function DashboardHeader() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateLoan = async (formData: CreateLoanFormData) => {
    try {
      await loanService.create({
        acervoId: formData.acervoId || 1,
        studentName: formData.studentName,
        studentClass: formData.studentClass,
        dueDate: formData.dueDate,
      });
      console.log('Empréstimo cadastrado com sucesso!');
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Erro ao cadastrar novo empréstimo:', error);
    }
  };

  function getGreeting(): string {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      return 'Bom dia';
    } else if (currentHour < 18) {
      return 'Boa tarde';
    } else {
      return 'Boa noite';
    }
  }

  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const capitalizedDate =
    formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  const greetingByPeriodOfDay = getGreeting();

  return (
    <>
      <div className="w-full flex justify-between items-center font-inter">
        <div className="flex flex-col">
          <h2 className="text-3xl font-playfair font-bold leading-tight">
            {greetingByPeriodOfDay},
          </h2>

          <p className="text-sm text-gray-500 font-sans">
            {capitalizedDate}.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="px-6 py-3 bg-emerald-900 hover:bg-emerald-950 text-white font-medium text-sm rounded-2xl transition-colors cursor-pointer flex items-center gap-2"
        >
          <Icon icon="lucide:plus" className="w-4 h-4" />
          Novo Empréstimo
        </button>
      </div>

      <CreateLoanModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateLoan}
      />
    </>
  );
}