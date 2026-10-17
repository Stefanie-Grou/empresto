import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import type { LentItem } from '../interfaces/LentItem';

export interface LoanModalData {
  id?: string | number;
  studentName: string;
  studentClass: string;
  bookId: number;
  dueDate: string;
  status?: string;
}

interface LoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: LoanModalData) => void;
  onRenew?: (item: LentItem) => void;
  initialData?: LentItem | null;
  mode?: 'create' | 'edit' | 'delete';
  books?: { id: string | number; bookTitle: string; available?: number }[];
}

function getDefaultDueDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const dia = String(date.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function parseToIso(value: string): string {
  if (!value) return '';
  if (value.includes('/')) {
    const parts = value.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
  }
  return value;
}

export default function LoanModal({
  isOpen,
  onClose,
  onSave,
  onRenew,
  initialData,
  mode = 'create',
  books = [],
}: LoanModalProps) {
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [bookId, setBookId] = useState<number>(0);
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<'Pendente' | 'Atrasado' | 'Devolvido'>('Pendente');
  const [errors, setErrors] = useState<{ studentName?: string; bookId?: string; dueDate?: string }>({});

  const isReadOnly = mode === 'delete';

  useEffect(() => {
    if (initialData) {
      setStudentName(initialData.studentName || '');
      setStudentClass(initialData.studentClass || '');
      const rawDate = (initialData as any).rawDueDate || parseToIso(initialData.dueDate);
      setDueDate(rawDate || getDefaultDueDate());
      const bId = (initialData as any).bookId || (initialData as any).id_livro;
      if (bId) {
        setBookId(Number(bId));
      } else {
        const found = books.find((b) => b.bookTitle.toLowerCase() === initialData.bookTitle.toLowerCase());
        setBookId(found ? Number(found.id) : 0);
      }
      setStatus((initialData.status as any) || 'Pendente');
    } else {
      setStudentName('');
      setStudentClass('');
      setBookId(books.length > 0 ? Number(books[0].id) : 0);
      setDueDate(getDefaultDueDate());
      setStatus('Pendente');
    }
    setErrors({});
  }, [initialData, isOpen, books]);

  if (!isOpen) return null;

  const validate = () => {
    if (isReadOnly) return true;
    const newErrors: { studentName?: string; bookId?: string; dueDate?: string } = {};

    if (!studentName.trim()) {
      newErrors.studentName = 'O nome do aluno é obrigatório.';
    }

    if (!bookId || bookId <= 0) {
      newErrors.bookId = 'Selecione um livro.';
    }

    if (!dueDate) {
      newErrors.dueDate = 'Informe a data limite de devolução.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      id: initialData?.id,
      studentName: studentName.trim(),
      studentClass: studentClass.trim(),
      bookId,
      dueDate,
      status,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-8 pt-6 pb-4 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 text-center w-full">
            {mode === 'delete'
              ? 'Remover Empréstimo'
              : mode === 'edit'
              ? 'Visualizar Empréstimo'
              : 'Cadastrar Novo Empréstimo'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <Icon icon="lucide:x" className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex items-center gap-3 flex-1">
              <label className="w-14 text-sm font-semibold text-gray-800 shrink-0">Nome</label>
              <div className="flex-1">
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Ana Silva de Souza"
                  disabled={isReadOnly}
                  className={`w-full px-4 py-2.5 bg-gray-100/80 rounded-xl text-sm text-gray-800 outline-none transition-all ${
                    errors.studentName
                      ? 'border border-red-500 bg-red-50/30'
                      : isReadOnly
                      ? 'cursor-not-allowed opacity-80'
                      : 'focus:bg-white focus:ring-2 focus:ring-emerald-800'
                  }`}
                />
                {errors.studentName && <span className="text-xs text-red-500 mt-1 block">{errors.studentName}</span>}
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-36">
              <label className="text-sm font-semibold text-gray-800 shrink-0">Turma</label>
              <input
                type="text"
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                placeholder="7B"
                disabled={isReadOnly}
                className={`w-full px-3 py-2.5 bg-gray-100/80 rounded-xl text-sm text-center text-gray-800 outline-none transition-all ${
                  isReadOnly ? 'cursor-not-allowed opacity-80' : 'focus:bg-white focus:ring-2 focus:ring-emerald-800'
                }`}
              />
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex items-center gap-3 flex-1">
              <label className="w-14 text-sm font-semibold text-gray-800 shrink-0">Livro</label>
              <div className="relative flex-1">
                <select
                  value={bookId}
                  onChange={(e) => setBookId(Number(e.target.value))}
                  disabled={isReadOnly}
                  className={`w-full px-4 py-2.5 bg-gray-100/80 rounded-xl text-sm text-gray-800 outline-none pr-8 appearance-none transition-all ${
                    errors.bookId
                      ? 'border border-red-500 bg-red-50/30'
                      : isReadOnly
                      ? 'cursor-not-allowed opacity-80'
                      : 'focus:bg-white focus:ring-2 focus:ring-emerald-800 cursor-pointer'
                  }`}
                >
                  <option value={0}>Selecione um livro...</option>
                  {books.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.bookTitle} {b.available !== undefined ? `(${b.available} disp.)` : ''}
                    </option>
                  ))}
                </select>
                <Icon
                  icon="lucide:search"
                  className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                />
                {errors.bookId && <span className="text-xs text-red-500 mt-1 block">{errors.bookId}</span>}
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-48">
              <label className="text-sm font-semibold text-gray-800 shrink-0">Prazo</label>
              <div className="flex-1">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  disabled={isReadOnly}
                  className={`w-full px-3 py-2.5 bg-gray-100/80 rounded-xl text-xs text-gray-800 outline-none transition-all ${
                    errors.dueDate
                      ? 'border border-red-500 bg-red-50/30'
                      : isReadOnly
                      ? 'cursor-not-allowed opacity-80'
                      : 'focus:bg-white focus:ring-2 focus:ring-emerald-800 cursor-pointer'
                  }`}
                />
                {errors.dueDate && <span className="text-xs text-red-500 mt-1 block">{errors.dueDate}</span>}
              </div>
            </div>
          </div>

          {mode === 'edit' && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <label className="text-sm font-semibold text-gray-800">Status</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('Pendente')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    status === 'Pendente'
                      ? 'bg-amber-100 text-amber-800 font-semibold ring-1 ring-amber-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Pendente
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('Atrasado')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    status === 'Atrasado'
                      ? 'bg-red-100 text-red-800 font-semibold ring-1 ring-red-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Atrasado
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('Devolvido')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    status === 'Devolvido'
                      ? 'bg-emerald-100 text-emerald-800 font-semibold ring-1 ring-emerald-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Devolvido
                </button>
              </div>
            </div>
          )}

          {mode === 'delete' && (
            <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
              <div className="w-10 h-10 rounded-full border-2 border-red-500 flex items-center justify-center shrink-0">
                <Icon icon="lucide:alert-triangle" className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-sm font-medium text-gray-700 leading-snug">
                Confirma a exclusão deste registro de empréstimo do livro "{initialData?.bookTitle}" para o aluno "{initialData?.studentName}"?
              </p>
            </div>
          )}

          <div className="flex items-center justify-center gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium text-sm rounded-2xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            {mode === 'edit' && onRenew && initialData && status !== 'Devolvido' && (
              <button
                type="button"
                onClick={() => onRenew(initialData)}
                className="px-6 py-3 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-medium text-sm rounded-2xl transition-colors cursor-pointer"
              >
                Renovar
              </button>
            )}

            <button
              type="submit"
              className={`px-10 py-3 text-white font-medium text-sm rounded-2xl transition-colors cursor-pointer ${
                mode === 'delete'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-emerald-900 hover:bg-emerald-950'
              }`}
            >
              {mode === 'delete' ? 'Excluir' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
