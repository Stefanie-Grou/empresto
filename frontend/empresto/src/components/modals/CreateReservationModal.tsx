import { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import { TextInput } from '../FormInput';
import { inventoryService } from '../../services/inventoryService';
import { type BookOption } from '../../interfaces/BookOption';

export interface CreateReservationFormData {
  userName: string;
  classGroup: string;
  acervoId: string | number;
  bookTitle: string;
  dueDate: string;
  itemType: string;
}

interface CreateReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateReservationFormData) => void;
}

// Função para calcular a data daqui a 7 dias no formato DD/MM/YYYY
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
  const [selectedBook, setSelectedBook] = useState<BookOption | null>(null);

  const [bookQuery, setBookQuery] = useState('');
  const [bookSuggestions, setBookSuggestions] = useState<BookOption[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dueDate = getFutureDateFormatted(7);

  useEffect(() => {
    if (isOpen) {
      setUserName('');
      setClassGroup('');
      setSelectedBook(null);
      setBookQuery('');
      setBookSuggestions([]);
      setIsDropdownOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const results = await inventoryService.searchBooks(bookQuery);
        setBookSuggestions(results);
      } catch (error) {
        console.error('Erro ao buscar livros:', error);
      }
    };

    const timer = setTimeout(() => {
      fetchBooks();
    }, 200);

    return () => clearTimeout(timer);
  }, [bookQuery]);

  const handleSelectBook = (book: BookOption) => {
    setSelectedBook(book);
    setBookQuery(book.bookTitle);
    setIsDropdownOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook) return;

    onSave({
      userName: userName.trim(),
      classGroup: classGroup.trim(),
      acervoId: selectedBook.id,
      bookTitle: selectedBook.bookTitle,
      dueDate,
      itemType: selectedBook.itemType,
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

        {/* Linha 3: Busca de Livro com Dropdown com visibilidade garantida */}
        <div className="relative">
          <TextInput
            label="Livro Desejado"
            value={bookQuery}
            onChange={(e) => {
              setBookQuery(e.target.value);
              setSelectedBook(null);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder="Digite o título do livro..."
            required
          />

          {/* Dropdown de Sugestões com alto contraste e legibilidade */}
          {isDropdownOpen && bookSuggestions.length > 0 && !selectedBook && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-2xl max-h-48 overflow-y-auto z-[100] divide-y divide-gray-100">
              {bookSuggestions.map((book) => (
                <div
                  key={book.id}
                  onClick={() => handleSelectBook(book)}
                  className="px-4 py-3 hover:bg-emerald-50/80 cursor-pointer flex flex-col text-left transition-colors"
                >
                  <span className="font-semibold text-gray-900 text-sm">
                    {book.bookTitle}
                  </span>
                  <span className="text-xs text-gray-500 font-medium mt-0.5">
                    {book.bookAuthor}
                  </span>
                </div>
              ))}
            </div>
          )}
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