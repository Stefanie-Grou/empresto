import { useState, useRef, useEffect, useLayoutEffect, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import { useBookSearch } from '../hooks/useBookSearch';
import type { BookOption } from '../interfaces/BookOption';

interface BookSearchInputProps {
  label: string;
  placeholder?: string;
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
  debounceMs?: number;
  initialValue?: string;
  onSelect: (book: BookOption | null) => void;
  onTextChange?: (text: string) => void;
}

interface DropdownPosition {
  top: number;
  left: number;
  width: number;
  placeAbove: boolean;
}

const DROPDOWN_MAX_HEIGHT = 240;
const DROPDOWN_GAP = 4;

export default function BookSearchInput({
  label,
  placeholder = 'Digite o título do livro...',
  invalid,
  required,
  disabled,
  debounceMs,
  initialValue = '',
  onSelect,
  onTextChange,
}: BookSearchInputProps) {
  const { query, setQuery, suggestions, isLoading, reset } = useBookSearch({ debounceMs });
  const [selectedBook, setSelectedBook] = useState<BookOption | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mantém o texto inicial (ex.: título de um empréstimo já registrado)
  const [lastInitialValue, setLastInitialValue] = useState(initialValue);
  if (initialValue !== lastInitialValue) {
    setLastInitialValue(initialValue);
    setQuery(initialValue);
    setSelectedBook(null);
    setIsDropdownOpen(false);
  }

  const activeValue = initialValue === lastInitialValue ? query : initialValue;
  const isDropdownVisible = isDropdownOpen && !disabled && !selectedBook;

  // Posiciona a lista via portal, ancorada no input (não é cortada pelo modal)
  useLayoutEffect(() => {
    if (!isDropdownVisible) {
      setDropdownPosition(null);
      return;
    }

    const updatePosition = () => {
      const input = containerRef.current?.querySelector('input');
      if (!input) return;

      const rect = input.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const placeAbove = spaceBelow < DROPDOWN_MAX_HEIGHT && rect.top > spaceBelow;

      setDropdownPosition({
        top: placeAbove ? rect.top - DROPDOWN_GAP : rect.bottom + DROPDOWN_GAP,
        left: rect.left,
        width: rect.width,
        placeAbove,
      });
    };

    updatePosition();

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isDropdownVisible]);

  // Fecha ao clicar fora (o clique pode cair fora do componente, já que a lista é um portal)
  useEffect(() => {
    if (!isDropdownVisible) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (containerRef.current?.contains(target)) return;
      if (dropdownRef.current?.contains(target)) return;
      setIsDropdownOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [isDropdownVisible]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setSelectedBook(null);
    onSelect(null);
    onTextChange?.(value);
    setIsDropdownOpen(true);
  };

  const handleSelectBook = (book: BookOption) => {
    setSelectedBook(book);
    setQuery(book.bookTitle);
    setIsDropdownOpen(false);
    onSelect(book);
    onTextChange?.(book.bookTitle);
  };

  const handleClear = () => {
    reset();
    setSelectedBook(null);
    setIsDropdownOpen(false);
    onSelect(null);
    onTextChange?.('');
  };

  const dropdown = isDropdownVisible && dropdownPosition
    ? createPortal(
        <div
          ref={dropdownRef as RefObject<HTMLDivElement>}
          style={{
            position: 'fixed',
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            maxHeight: DROPDOWN_MAX_HEIGHT,
            transform: dropdownPosition.placeAbove ? 'translateY(-100%)' : undefined,
          }}
          className="z-[100] bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-y-auto divide-y divide-gray-100"
        >
          {isLoading && suggestions.length === 0 && (
            <div className="px-4 py-3 text-xs text-gray-500 font-medium">
              Buscando livros...
            </div>
          )}

          {!isLoading && suggestions.length === 0 && (
            <div className="px-4 py-3 text-xs text-gray-500 font-medium">
              Nenhum livro encontrado.
            </div>
          )}

          {suggestions.map((book) => (
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
        </div>,
        document.body
      )
    : null;

  return (
    <div ref={containerRef} className="flex items-center justify-between gap-4">
      <label className="text-sm font-semibold text-gray-800 shrink-0">
        {label}
      </label>

      <div className="flex-1 relative">
        <input
          type="text"
          value={activeValue}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => setIsDropdownOpen(true)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          className={`w-full px-4 py-2.5 pr-10 bg-gray-100/80 rounded-xl text-sm text-gray-800 outline-none transition-all ${
            invalid
              ? 'border border-red-500 bg-red-50/30'
              : 'focus:bg-white focus:ring-2 focus:ring-emerald-800'
          } ${disabled ? 'cursor-not-allowed text-gray-500' : ''}`}
        />

        {activeValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-600 rounded-lg transition-colors cursor-pointer"
            title="Limpar"
          >
            <Icon icon="lucide:x" className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {dropdown}
    </div>
  );
}
