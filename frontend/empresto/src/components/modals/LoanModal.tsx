import { useState, useEffect } from 'react';
import type { LentItem } from '../../interfaces/LentItem';
import BaseModal from './BaseModal';
import { TextInput } from '../FormInput';

interface LoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: LentItem) => void;
  onRenew?: (item: LentItem) => void;
  onReturn?: (item: LentItem) => void; // Nova prop para lidar com a ação de devolução
  loan: LentItem | null;
  title?: string;
  isReadOnly?: boolean;
  warningMessage?: string;
  submitLabel?: string;
}

// Campos que o formulário realmente permite alterar (nome, turma, livro, prazo)
function toEditableValues(item: LentItem) {
  return {
    studentName: (item.studentName || '').trim(),
    studentClass: (item.studentClass || '').trim(),
    bookTitle: (item.bookTitle || '').trim(),
    dueDate: (item.dueDate || '').trim(),
  };
}

function hasChanges(current: LentItem, original: LentItem): boolean {
  const a = toEditableValues(current);
  const b = toEditableValues(original);

  return (
    a.studentName !== b.studentName ||
    a.studentClass !== b.studentClass ||
    a.bookTitle !== b.bookTitle ||
    a.dueDate !== b.dueDate
  );
}

export default function LoanModal({
  isOpen,
  onClose,
  onSave,
  onRenew,
  onReturn,
  loan,
  title = 'Visualizar Empréstimo',
  isReadOnly = true,
  warningMessage,
  submitLabel = 'Salvar',
}: LoanModalProps) {
  const [formData, setFormData] = useState<LentItem | null>(null);
  // Guarda o empréstimo original para detectar se houve alteração
  const [originalLoan, setOriginalLoan] = useState<LentItem | null>(null);

  useEffect(() => {
    if (loan) {
      setFormData({ ...loan });
      setOriginalLoan({ ...loan });
    }
  }, [loan, isOpen]);

  if (!loan || !formData) return null;

  const handleInputChange = (field: keyof LentItem, value: string) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const isAtrasado = formData.status.toLowerCase() === 'atrasado';

  const isDirty = originalLoan ? hasChanges(formData, originalLoan) : false;

  const shouldShowSubmitButton = Boolean(warningMessage) || !isReadOnly || submitLabel === 'Devolver';

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      onSubmit={(e) => {
        e.preventDefault();
        if (submitLabel === 'Devolver' && onReturn) {
          onReturn(formData);
          return;
        }
        // Nada mudou: fecha o modal sem chamar o endpoint
        if (!isDirty) {
          onClose();
          return;
        }
        onSave(formData);
      }}
      warningMessage={warningMessage}
      submitLabel={shouldShowSubmitButton ? submitLabel : undefined}
      extraActions={
        !warningMessage && isReadOnly && submitLabel !== 'Devolver' && (
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
          {/* O livro não é editável: para trocar, exclua e registre um novo empréstimo */}
          <TextInput
            label="Livro"
            value={formData.bookTitle}
            onChange={() => {}}
            disabled
            readOnly
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