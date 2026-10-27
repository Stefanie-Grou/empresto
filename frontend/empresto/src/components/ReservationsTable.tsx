import { Icon } from '@iconify/react';
import type { LentItem } from '../interfaces/LentItem';
import Pagination from './Pagination';

interface ReservationsTableProps {
  title?: string;
  items: LentItem[];
  isLoading?: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit?: (item: LentItem) => void;
  onDelete?: (item: LentItem) => void;
}

export default function ReservationsTable({
  title = 'Fila de Espera',
  items,
  isLoading = false,
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
}: ReservationsTableProps) {
  return (
    <div className="bg-white-background border border-100-gray rounded-2xl p-6 shadow-xs w-full flex flex-col justify-between h-full">
      <div>
        {title && (
          <h2 className="text-2xl font-playfair main-background-green mb-6">
            {title}
          </h2>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-jakarta">
            <thead>
              <tr className="text-xs uppercase font-semibold text-medium-gray border-b border-100-gray">
                <th className="pb-4 font-medium text-center">FILA</th>
                <th className="pb-4 font-medium">LIVRO</th>
                <th className="pb-4 font-medium">NOME</th>
                <th className="pb-4 font-medium text-center">TURMA</th>
                <th className="pb-4 font-medium text-center">TIPO</th>
                <th className="pb-4 font-medium text-center">DATA DO PEDIDO</th>
                <th className="pb-4 font-medium text-center">AÇÕES</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-800 animate-bounce" style={{ animationDelay: '-0.3s' }} />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-800 animate-bounce" style={{ animationDelay: '-0.15s' }} />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-800 animate-bounce" />
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-xs text-gray-400">
                    Nenhuma reserva encontrada.
                  </td>
                </tr>
              ) : items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3.5 pl-2 text-center text-gray-600 font-medium">
                    {item.id}
                  </td>

                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-3">
                      {item.coverUrl ? (
                        <img
                          src={item.coverUrl}
                          alt={item.bookTitle}
                          className="w-10 h-12 object-cover rounded-lg shadow-2xs"
                        />
                      ) : (
                        <div className="w-10 h-12 bg-main-background-green/60 rounded-lg shrink-0" />
                      )}
                      <div className="flex flex-col">
                        <span className="font-bold text-full-black leading-snug">
                          {item.bookTitle}
                        </span>
                        <span className="text-xs text-gray-400">
                          {item.bookAuthor}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 text-gray-800 font-medium">
                    {item.studentName}
                  </td>

                  <td className="py-3.5 text-center text-gray-600">
                    {item.studentClass || '-'}
                  </td>

                  <td className="py-3.5 text-center text-gray-600 font-medium">
                    {item.personType || 'Aluno'}
                  </td>

                  <td className="py-3.5 text-center text-gray-600 font-medium">
                    {item.dueDate}
                  </td>

                  <td className="py-3.5 pr-2 text-right">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit?.(item)}
                        className="p-1.5 bg-emerald-100/60 hover:bg-emerald-200 text-emerald-700 rounded-lg transition-colors cursor-pointer"
                        title="Editar"
                      >
                        <Icon icon="lucide:pencil" className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete?.(item)}
                        className="p-1.5 bg-red-100/60 hover:bg-red-200 text-soft-red rounded-lg transition-colors cursor-pointer"
                        title="Excluir"
                      >
                        <Icon icon="lucide:x" className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
