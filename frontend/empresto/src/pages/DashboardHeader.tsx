import { useState } from 'react';
import { Icon } from '@iconify/react';
import CreateLoanModal, { type CreateLoanFormData } from '../components/modals/CreateLoanModal';
import { loanService } from '../services/loanService';

interface DashboardHeaderProps {
  onNewLoanClick?: () => void;
}

export default function DashboardHeader({ onNewLoanClick }: DashboardHeaderProps = {}) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateLoan = async (formData: CreateLoanFormData) => {
    try {
      await loanService.create({
        studentName: formData.studentName,
        studentClass: formData.studentClass,
        acervoId: formData.acervoId,
        dueDate: formData.dueDate,
      });
      setIsCreateModalOpen(false);
    } catch {
      // O toast de erro é exibido pelo loanService
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

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

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
          onClick={onNewLoanClick || (() => setIsCreateModalOpen(true))}
          className="buttons bg-main-background-green text-white flex items-center gap-2 cursor-pointer"
        >
          <Icon icon="lucide:plus" className="w-4 h-4" />
          <span>Novo empréstimo</span>
        </button>
      </div>

      {!onNewLoanClick && (
        <CreateLoanModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreateLoan}
        />
      )}
    </>
  );
}
