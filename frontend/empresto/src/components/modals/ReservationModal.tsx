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
        {/* Nome do Aluno */}
        <div>
          <TextInput
            label="Nome do Aluno"
            value={formData.studentName}
            onChange={(e) => handleInputChange('studentName', e.target.value)}
            disabled={isReadOnly}
            readOnly={isReadOnly}
            required
          />
        </div>

        {/* Turma */}
        <div>
          <TextInput
            label="Turma"
            value={formData.studentClass || ''}
            onChange={(e) => handleInputChange('studentClass', e.target.value)}
            disabled={isReadOnly}
            readOnly={isReadOnly}
          />
        </div>

        {/* Livro Desejado */}
        <div>
          <TextInput
            label="Título do Livro"
            value={formData.bookTitle}
            onChange={(e) => handleInputChange('bookTitle', e.target.value)}
            disabled={isReadOnly}
            readOnly={isReadOnly}
            required
          />
        </div>

        {/* Prazo / Data */}
        <div>
          <TextInput
            label="Prazo"
            value={formData.dueDate}
            onChange={(e) => handleInputChange('dueDate', e.target.value)}
            disabled={isReadOnly}
            readOnly={isReadOnly}
          />
        </div>
      </div>
    </BaseModal>
  );
}