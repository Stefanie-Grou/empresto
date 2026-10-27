import { useState, useEffect } from 'react';
import type { LentItem } from '../../interfaces/LentItem';
import BaseModal from './BaseModal';
import { TextInput } from '../FormInput';

interface LoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: LentItem) => void;
  onRenew?: (item: LentItem) => void;
  onReturn?: (item: LentItem) => void;
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

// Campos que o formulário realmente permite alterar
function toEditableValues(item: LentItem) {
  return {
    studentName: (item.studentName || '').trim(),
    personType: (item.personType || '').trim(),
    studentClass: (item.studentClass || '').trim(),
    dueDate: (item.dueDate || '').trim(),
    status: (item.status || '').trim(),
  };
}

// O livro não é editável neste modal, então nem entra na comparação
function hasChanges(current: LentItem, original: LentItem): boolean {
  const a = toEditableValues(current);
  const b = toEditableValues(original);

  return (
    a.studentName !== b.studentName ||
    a.personType !== b.personType ||
    a.studentClass !== b.studentClass ||
    a.dueDate !== b.dueDate ||
    a.status !== b.status
  );
}

function isPastDue(dateStr: string): boolean {
  if (!dateStr) return false;
  let due: Date;
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      due = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    } else {
      return false;
    }
  } else if (dateStr.includes('-')) {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      due = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    } else {
      return false;
    }
  } else {
    return false;
  }

  due.setHours(23, 59, 59, 999);
  return new Date() > due;
}

const STATUS_ERROR_MESSAGE =
  'Não é possível definir como Atrasado pois o prazo de devolução ainda não venceu.';

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (loan) {
      setFormData({ ...loan });
      setOriginalLoan({ ...loan });
    }
    setErrorMessage(null);
  }, [loan, isOpen]);

  if (!loan || !formData) return null;

  const handleInputChange = (field: keyof LentItem, value: string) => {
    setErrorMessage(null);
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleStatusChange = (newStatus: string) => {
    setErrorMessage(null);
    if (newStatus === 'Atrasado' && !isPastDue(formData.dueDate)) {
      setErrorMessage(STATUS_ERROR_MESSAGE);
      return;
    }
    setFormData((prev) => (prev ? { ...prev, status: newStatus } : null));
  };

  const isAtrasado = formData.status.toLowerCase() === 'atrasado';

  const isDirty = originalLoan ? hasChanges(formData, originalLoan) : false;

  const shouldShowSubmitButton = Boolean(warningMessage) || !isReadOnly || submitLabel === 'Devolver';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Devolução não depende de alterações no formulário
    if (submitLabel === 'Devolver' && onReturn) {
      onReturn(formData);
      return;
    }

    // Validação do status (mesma regra do select)
    if (!isReadOnly && formData.status === 'Atrasado' && !isPastDue(formData.dueDate)) {
      setErrorMessage(STATUS_ERROR_MESSAGE);
      return;
    }

    // Nada mudou: fecha o modal sem chamar o endpoint
    if (!isDirty) {
      onClose();
      return;
    }

    onSave(formData);
  };

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
        <div className="col-span-8">
          <TextInput
            label="Nome"
            value={formData.studentName}
            onChange={(e) => handleInputChange('studentName', e.target.value)}
            disabled={isReadOnly}
            readOnly={isReadOnly}
            required
          />
        </div>
        <div className="col-span-4">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-semibold text-gray-800 shrink-0">Tipo</label>
            <select
              value={formData.personType || 'Aluno'}
              disabled={isReadOnly}
              onChange={(e) => handleInputChange('personType', e.target.value)}
              className={`w-full px-3 py-2 bg-gray-100/80 rounded-xl text-xs font-medium text-gray-800 outline-none ${
                isReadOnly ? 'cursor-not-allowed text-gray-500' : 'focus:bg-white focus:ring-2 focus:ring-emerald-800 cursor-pointer'
              }`}
            >
              <option value="Aluno">Aluno</option>
              <option value="Professor">Professor</option>
              <option value="Funcionário">Funcionário</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3 items-center">
        <div className="col-span-7">
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
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3 items-center">
        <div className="col-span-12">
          {/* O livro não é editável: para trocar, exclua e registre um novo empréstimo */}
          <TextInput
            label="Livro"
            value={formData.bookTitle}
            onChange={() => {}}
            disabled
            readOnly
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-2 pt-2">
        <div className="flex items-center justify-center gap-4">
          <span className="text-sm font-semibold text-gray-800">Status</span>
          {isReadOnly ? (
            <span
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold ${
                isAtrasado ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {formData.status}
            </span>
          ) : (
            <select
              value={formData.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-3 py-1.5 bg-gray-100/80 rounded-xl text-xs font-semibold text-gray-800 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-800 cursor-pointer"
            >
              <option value="Pendente">Pendente</option>
              <option value="Atrasado">Atrasado</option>
              <option value="Devolvido">Devolvido</option>
            </select>
          )}
        </div>
        {errorMessage && (
          <span className="text-xs text-red-600 font-medium text-center">{errorMessage}</span>
        )}
      </div>
    </BaseModal>
  );
}
