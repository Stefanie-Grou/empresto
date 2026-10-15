import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import type { InventoryItem } from '../interfaces/InventoryItem';
import { TextInput, NumberInput } from './FormInput';
import { validateNotEmpty, validateMinNumber } from '../utils/validationUtils';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemData: Omit<InventoryItem, 'id' | 'available'>) => void;
  title?: string;
  initialData?: InventoryItem | null;
}

export default function ItemModal({
  isOpen,
  onClose,
  onSave,
  title,
  initialData,
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
      setItemType(initialData.itemType || 'Livro');
    } else {
      setBookTitle('');
      setBookAuthor('');
      setQuantity(1);
      setItemType('Livro');
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const titleError = validateNotEmpty(bookTitle, 'Título');
    const authorError = validateNotEmpty(bookAuthor, 'Autor(a)');
    const quantityError = validateMinNumber(quantity, 0, 'Quantidade');

    const newErrors = {
      ...(titleError && { bookTitle: titleError }),
      ...(authorError && { bookAuthor: authorError }),
      ...(quantityError && { quantity: quantityError }),
    };

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      bookTitle: bookTitle.trim(),
      bookAuthor: bookAuthor.trim(),
      quantity: Number(quantity),
      itemType,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-8 pt-6 pb-4 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 text-center w-full">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <Icon icon="lucide:x" className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <TextInput
            label="Título"
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
            placeholder="Ex: Rita Lee - Uma Autobiografia"
            error={errors.bookTitle}
          />

          <TextInput
            label="Autor(a)"
            value={bookAuthor}
            onChange={(e) => setBookAuthor(e.target.value)}
            placeholder="Ex: Rita Lee"
            error={errors.bookAuthor}
          />

          <div className="flex items-center gap-4 pt-1">
            <NumberInput
              label="Quantidade"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
              error={errors.quantity}
            />

            <div className="flex items-center gap-3 flex-1 justify-end">
              <label className="text-sm font-semibold text-gray-800 shrink-0">Tipo</label>
              <div className="relative flex-1 max-w-[160px]">
                <select
                  value={itemType}
                  onChange={(e) => setItemType(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-100/80 appearance-none rounded-xl text-sm text-gray-800 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-800 cursor-pointer pr-8"
                >
                  <option value="Livro">Livro</option>
                  <option value="Revista">Revista</option>
                  <option value="Quadrinho">Quadrinho</option>
                  <option value="Outro">Outro</option>
                </select>
                <Icon
                  icon="lucide:chevron-down"
                  className="w-4 h-4 text-emerald-900 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium text-sm rounded-2xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-10 py-3 bg-emerald-900 hover:bg-emerald-950 text-white font-medium text-sm rounded-2xl transition-colors cursor-pointer"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}