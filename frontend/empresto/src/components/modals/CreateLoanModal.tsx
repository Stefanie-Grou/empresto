import { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import { TextInput } from '../FormInput';

interface CreateLoanFormData {
  acervoId: number | string;
  studentName: string;
  studentClass: string;
  bookTitle: string;
  dueDate: string;
}

interface CreateLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateLoanFormData) => void;
  title?: string;
  submitLabel?: string;
}

const INITIAL_FORM_STATE: CreateLoanFormData = {
  acervoId: '',
  studentName: '',
  studentClass: '',
  bookTitle: '',
  dueDate: '',
};

export default function CreateLoanModal({
  isOpen,
  onClose,
  onSave,
  title = 'Novo Empréstimo',
  submitLabel = 'Salvar',
}: CreateLoanModalProps) {
  const [formData, setFormData] = useState<CreateLoanFormData>(INITIAL_FORM_STATE);

  useEffect(() => {
    if (isOpen) {
      setFormData(INITIAL_FORM_STATE);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (field: keyof CreateLoanFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      onSubmit={handleSubmit}
      submitLabel={submitLabel}
    >
      <div className="grid grid-cols-12 gap-3 items-center">
        <div className="col-span-7">
          <TextInput
            label="Nome"
            value={formData.studentName}
            onChange={(e) => handleInputChange('studentName', e.target.value)}
            placeholder="Ana Martins"
            required
          />
        </div>
        <div className="col-span-5">
          <TextInput
            label="Turma"
            value={formData.studentClass}
            onChange={(e) => handleInputChange('studentClass', e.target.value)}
            placeholder="7B"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3 items-center">
        <div className="col-span-7">
          <TextInput
            label="Livro"
            value={formData.bookTitle}
            onChange={(e) => handleInputChange('bookTitle', e.target.value)}
            placeholder="O Auto da Compadecida"
            required
          />
        </div>
        <div className="col-span-5">
          <TextInput
            label="Prazo"
            value={formData.dueDate}
            onChange={(e) => handleInputChange('dueDate', e.target.value)}
            placeholder="10/09/2026"
            required
          />
        </div>
      </div>
    </BaseModal>
  );
}