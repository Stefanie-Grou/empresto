import { useState, useEffect } from 'react';
import type { LentItem } from '../../interfaces/LentItem';
import BaseModal from './BaseModal';
import { TextInput } from '../FormInput';

interface LoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: LentItem) => void;
  onRenew?: (item: LentItem) => void;
  loan: LentItem | null;
  title?: string;
  isReadOnly?: boolean;
  warningMessage?: string;
  submitLabel?: string;
}

export default function LoanModal({
  isOpen,
  onClose,
  onSave,
  onRenew,
  loan,
  title = 'Visualizar Empréstimo',
  isReadOnly = true,
  warningMessage,
  submitLabel = 'Salvar',
}: LoanModalProps) {
  const [formData, setFormData] = useState<LentItem | null>(null);

  useEffect(() => {
    if (loan) {
      setFormData({ ...loan });
    }
  }, [loan, isOpen]);

  if (!loan || !formData) return null;

  const handleInputChange = (field: keyof LentItem, value: string) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const isAtrasado = formData.status.toLowerCase() === 'atrasado';

  // O botão principal (Salvar / Excluir) só deve aparecer se:
  // 1. Tiver uma mensagem de aviso (como no modal de exclusão)
  // 2. OU se NÃO for apenas modo de leitura (modo edição)
  const shouldShowSubmitButton = Boolean(warningMessage) || !isReadOnly;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      onSubmit={(e) => {
        e.preventDefault();
        onSave(formData);
      }}
      warningMessage={warningMessage}
      submitLabel={shouldShowSubmitButton ? submitLabel : undefined}
      extraActions={
        // O botão Renovar só aparece quando estiver em modo leitura E sem mensagem de exclusão/aviso
        !warningMessage && isReadOnly && (
          <button
            type="button"
            onClick={() => {
              onRenew?.(formData);
              onClose();
            }}
            className="px-10 py-3 bg-emerald-900 hover:bg-emerald-950 text-white font-medium text-sm rounded-2xl transition-colors cursor-pointer"
          >
            Renovar
          </button>
        )
      }
    >
      <div className="grid grid-cols-12 gap-3 items-center">
        <div className="col-span-7">
          <TextInput
            label="Nome"
            value={formData.studentName}
            onChange={(e) => handleInputChange('studentName', e.target.value)}
            disabled={isReadOnly}
            readOnly={isReadOnly}
          />
        </div>
        <div className="col-span-5">
          <TextInput
            label="Turma"
            value={formData.studentClass || ''}
            onChange={(e) => handleInputChange('studentClass', e.target.value)}
            disabled={isReadOnly}
            readOnly={isReadOnly}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3 items-center">
        <div className="col-span-7">
          <TextInput
            label="Livro"
            value={formData.bookTitle}
            onChange={(e) => handleInputChange('bookTitle', e.target.value)}
            disabled={isReadOnly}
            readOnly={isReadOnly}
          />
        </div>
        <div className="col-span-5">
          <TextInput
            label="Prazo"
            value={formData.dueDate}
            onChange={(e) => handleInputChange('dueDate', e.target.value)}
            disabled={isReadOnly}
            readOnly={isReadOnly}
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 pt-2">
        <span className="text-sm font-semibold text-gray-800">Status</span>
        <span
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold ${
            isAtrasado ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'
          }`}
        >
          {formData.status}
        </span>
      </div>
    </BaseModal>
  );
}