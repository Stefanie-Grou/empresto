import { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import { TextInput } from '../FormInput';
import BookSearchInput from '../BookSearchInput';
import type { BookOption } from '../../interfaces/BookOption';

export interface CreateLoanFormData {
  acervoId: number;
  studentName: string;
  studentClass: string;
  personType: 'Aluno' | 'Professor' | 'Funcionário';
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

function getDefaultDueDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  const dia = String(date.getDate()).padStart(2, '0');
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const ano = date.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

const INITIAL_FORM_STATE: CreateLoanFormData = {
  acervoId: 0,
  studentName: '',
  studentClass: '',
  personType: 'Aluno',
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
      setFormData({
        ...INITIAL_FORM_STATE,
        dueDate: getDefaultDueDate(),
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (field: keyof CreateLoanFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectBook = (book: BookOption | null) => {
    setFormData((prev) => ({
      ...prev,
      bookTitle: book?.bookTitle || '',
      acervoId: book ? Number(book.id) : 0,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      studentClass: formData.personType === 'Aluno' ? formData.studentClass.trim() : (formData.studentClass.trim() || '-'),
    });
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
        <div className="col-span-8">
          <TextInput
            label="Nome"
            value={formData.studentName}
            onChange={(e) => handleInputChange('studentName', e.target.value)}
            placeholder="Nome da pessoa"
            required
          />
        </div>
        <div className="col-span-4">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-semibold text-gray-800 shrink-0">Tipo</label>
            <select
              value={formData.personType}
              onChange={(e) => handleInputChange('personType', e.target.value as any)}
              className="w-full px-3 py-2 bg-gray-100/80 rounded-xl text-xs font-medium text-gray-800 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-800 cursor-pointer"
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
            value={formData.studentClass}
            onChange={(e) => handleInputChange('studentClass', e.target.value)}
            placeholder={formData.personType === 'Aluno' ? 'Ex: 9º Ano A' : '-'}
            required={formData.personType === 'Aluno'}
          />
        </div>
        <div className="col-span-5">
          <TextInput
            label="Prazo"
            value={formData.dueDate}
            onChange={(e) => handleInputChange('dueDate', e.target.value)}
            placeholder="DD/MM/AAAA"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3 items-center">
        <div className="col-span-12">
          <BookSearchInput
            label="Livro"
            placeholder="Digite o título do livro..."
            onSelect={handleSelectBook}
            onTextChange={(text) => setFormData((prev) => ({ ...prev, bookTitle: text }))}
            required
          />
        </div>
      </div>
    </BaseModal>
  );
}
