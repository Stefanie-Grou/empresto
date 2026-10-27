import { useState, useEffect } from 'react';
import type { InventoryItem } from '../../interfaces/InventoryItem';
import { TextInput, NumberInput } from '../FormInput';
import { validateNotEmpty, validateMinNumber } from '../../utils/validationUtils';
import BaseModal from './BaseModal';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemData: Omit<InventoryItem, 'id' | 'available'>) => void;
  title?: string;
  initialData?: InventoryItem | null;
  isReadOnly?: boolean;
  warningMessage?: string;
  submitLabel?: string;
}

export default function ItemModal({
  isOpen,
  onClose,
  onSave,
  title = 'Cadastrar Item no Acervo',
  initialData,
  isReadOnly = false,
  warningMessage,
  submitLabel = 'Salvar',
}: ItemModalProps) {
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [itemType, setItemType] = useState('Livro');
  const [errors, setErrors] = useState<{ bookTitle?: string; bookAuthor?: string; quantity?: string }>({});

  useEffect(() => {
    if (initialData) {
      setBookTitle(initialData.bookTitle);
      setBookAuthor(initialData.bookAuthor);
      setQuantity(initialData.quantity);
      setItemType(initialData.itemType || '-');
    } else {
      setBookTitle('');
      setBookAuthor('');
      setQuantity(1);
      setItemType('Livro');
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isReadOnly) {
      const titleError = validateNotEmpty(bookTitle, 'Título');
      const authorError = validateNotEmpty(bookAuthor, 'Autor(a)');
      const quantityError = validateMinNumber(quantity, 0, 'Quantidade');

      if (titleError || authorError || quantityError) {
        setErrors({
          ...(titleError && { bookTitle: titleError }),
          ...(authorError && { bookAuthor: authorError }),
          ...(quantityError && { quantity: quantityError }),
        });
        return;
      }
    }

    onSave({
      bookTitle: bookTitle.trim(),
      bookAuthor: bookAuthor.trim(),
      quantity: Number(quantity),
      itemType,
    });
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      onSubmit={handleSubmit}
      warningMessage={warningMessage}
      submitLabel={submitLabel}
    >
      <TextInput
        label="Título"
        value={bookTitle}
        onChange={(e) => setBookTitle(e.target.value)}
        placeholder="Ex: Rita Lee - Uma Autobiografia"
        error={errors.bookTitle}
        disabled={isReadOnly}
      />

      <TextInput
        label="Autor(a)"
        value={bookAuthor}
        onChange={(e) => setBookAuthor(e.target.value)}
        placeholder="Ex: Rita Lee"
        error={errors.bookAuthor}
        disabled={isReadOnly}
      />

      <div className="flex items-center gap-4 pt-1">
        <NumberInput
          label="Quantidade"
          min="0"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
          error={errors.quantity}
          disabled={isReadOnly}
        />

        <div className="flex items-center gap-3 flex-1 justify-end">
          <label className="text-sm font-semibold text-gray-800 shrink-0">Tipo</label>
          <div className="relative flex-1 max-w-[160px]">
            <select
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
              disabled={isReadOnly}
              className="w-full px-4 py-2 bg-gray-100/80 rounded-xl text-sm text-gray-800 outline-none"
            >
              <option value="Livro">Livro</option>
              <option value="Revista">Revista</option>
              <option value="Quadrinho">Quadrinho</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
