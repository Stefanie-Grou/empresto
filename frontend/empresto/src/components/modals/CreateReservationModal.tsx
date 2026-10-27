import { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import { TextInput } from '../FormInput';
import BookSearchInput from '../BookSearchInput';
import type { BookOption } from '../../interfaces/BookOption';

export interface CreateReservationFormData {
  userName: string;
  personType: 'Aluno' | 'Professor' | 'Funcionário';
  classGroup: string;
  acervoId: number;
  bookTitle: string;
  dueDate: string;
}

interface CreateReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateReservationFormData) => void;
}

function getFutureDateFormatted(daysAhead: number = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function CreateReservationModal({
  isOpen,
  onClose,
  onSave,
}: CreateReservationModalProps) {
  const [userName, setUserName] = useState('');
  const [personType, setPersonType] = useState<'Aluno' | 'Professor' | 'Funcionário'>('Aluno');
  const [classGroup, setClassGroup] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [acervoId, setAcervoId] = useState(0);

  const dueDate = getFutureDateFormatted(0);

  useEffect(() => {
    if (isOpen) {
      setUserName('');
      setPersonType('Aluno');
      setClassGroup('');
      setBookTitle('');
      setAcervoId(0);
    }
  }, [isOpen]);

  const handleSelectBook = (book: BookOption | null) => {
    setBookTitle(book?.bookTitle || '');
    setAcervoId(book ? Number(book.id) : 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      userName: userName.trim(),
      personType,
      classGroup: personType === 'Aluno' ? classGroup.trim() : (classGroup.trim() || '-'),
      acervoId,
      bookTitle,
      dueDate,
    });
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Nova Reserva"
      onSubmit={handleSubmit}
      submitLabel="Reservar"
    >
      <div className="flex flex-col space-y-4">
        <div className="grid grid-cols-12 gap-3 items-center">
          <div className="col-span-8">
            <TextInput
              label="Nome"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Nome da pessoa"
              required
            />
          </div>
          <div className="col-span-4">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-semibold text-gray-800 shrink-0">Tipo</label>
              <select
                value={personType}
                onChange={(e) => setPersonType(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-100/80 rounded-xl text-xs font-medium text-gray-800 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-800 cursor-pointer"
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
            value={classGroup}
            onChange={(e) => setClassGroup(e.target.value)}
            placeholder={personType === 'Aluno' ? 'Ex: 8º B' : '-'}
            required={personType === 'Aluno'}
          />
        </div>

        <div>
          <BookSearchInput
            label="Livro"
            placeholder="Digite o título do livro..."
            onSelect={handleSelectBook}
            onTextChange={(text) => setBookTitle(text)}
            required
          />
        </div>
      </div>
    </BaseModal>
  );
}
