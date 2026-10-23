import { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import { TextInput } from '../FormInput';
import BookSearchInput from '../BookSearchInput';
import type { BookOption } from '../../interfaces/BookOption';

export interface CreateReservationFormData {
  userName: string;
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

function getFutureDateFormatted(daysAhead: number = 7): string {
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
  const [classGroup, setClassGroup] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [acervoId, setAcervoId] = useState(0);

  const dueDate = getFutureDateFormatted(7);

  useEffect(() => {
    if (isOpen) {
      setUserName('');
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
      classGroup: classGroup.trim(),
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
        {/* Linha 1: Nome do Aluno */}
        <div>
          <TextInput
            label="Nome do Aluno"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Ex: João da Silva"
            required
          />
        </div>

        {/* Linha 2: Turma (Opcional) */}
        <div>
          <TextInput
            label="Turma (Opcional)"
            value={classGroup}
            onChange={(e) => setClassGroup(e.target.value)}
            placeholder="Ex: 8º B"
          />
        </div>

        {/* Linha 3: Busca de Livro com Dropdown de sugestões */}
        <div>
          <BookSearchInput
            label="Livro Desejado"
            key={isOpen ? 'open' : 'closed'}
            onSelect={handleSelectBook}
            onTextChange={setBookTitle}
            required
          />
        </div>

        {/* Linha 4: Prazo de Devolução (+7 dias) */}
        <div>
          <TextInput
            label="Prazo de Devolução (Automático)"
            value={dueDate}
            onChange={() => {}}
            disabled
            readOnly
          />
        </div>
      </div>
    </BaseModal>
  );
}
