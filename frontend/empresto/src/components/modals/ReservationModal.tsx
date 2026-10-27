import { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import { TextInput } from '../FormInput';
import type { LentItem } from '../../interfaces/LentItem';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: LentItem) => void;
  reservation: LentItem | null;
  title?: string;
  isReadOnly?: boolean;
  warningMessage?: string;
  submitLabel?: string;
}

export default function ReservationModal({
  isOpen,
  onClose,
  onSave,
  reservation,
  title = 'Visualizar Reserva',
  isReadOnly = true,
  warningMessage,
  submitLabel = 'Salvar',
}: ReservationModalProps) {
  const [formData, setFormData] = useState<LentItem | null>(null);

  useEffect(() => {
    if (reservation) {
      setFormData({ ...reservation });
    }
  }, [reservation, isOpen]);

  if (!reservation || !formData) return null;

  const handleInputChange = (field: keyof LentItem, value: string) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

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
    >
      <div className="flex flex-col space-y-4">
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

        <div>
          <TextInput
            label="Turma"
            value={formData.studentClass || ''}
            onChange={(e) => handleInputChange('studentClass', e.target.value)}
            disabled={isReadOnly}
            readOnly={isReadOnly}
          />
        </div>

        <div>
          <TextInput
            label="Livro"
            value={formData.bookTitle}
            onChange={(e) => handleInputChange('bookTitle', e.target.value)}
            disabled
            readOnly
            required
          />
        </div>

        <div>
          <TextInput
            label="Data do Pedido"
            value={formData.dueDate}
            onChange={(e) => handleInputChange('dueDate', e.target.value)}
            disabled
            readOnly
          />
        </div>
      </div>
    </BaseModal>
  );
}
