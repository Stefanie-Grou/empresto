import { Icon } from '@iconify/react';
import type { InventoryItem } from '../interfaces/InventoryItem';
import Pagination from './Pagination';

interface ItemsTableProps {
    title?: string;
    items: InventoryItem[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onEdit?: (item: InventoryItem) => void;
    onDelete?: (item: InventoryItem) => void;
}

export default function ItemsTable({
    title = 'Itens novos no acervo',
    items,
    currentPage,
    totalPages,
    onPageChange,
    onEdit,
    onDelete,
}: ItemsTableProps) {
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
                            <tr className="text-xs uppercase font-semibold text-medium-gray border-b border-100-gray text-center">
                                <th className="pb-4 font-medium">CÓDIGO</th>
                                <th className="pb-4 font-medium">TÍTULO</th>
                                <th className="pb-4 font-medium">TIPO</th>
                                <th className="pb-4 font-medium">QUANTIDADE</th>
                                <th className="pb-4 font-medium">DISPONÍVEIS</th>
                                <th className="pb-4 font-medium">AÇÕES</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-50">
                            {items.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-3.5 pl-2 text-gray-600 font-medium">
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

                                    <td className="py-3.5 text-medium-gray">
                                        {item.itemType}
                                    </td>

                                    <td className="py-3.5 text-center text-gray-700 font-medium">
                                        {item.quantity}
                                    </td>

                                    <td className="py-3.5 text-center text-gray-700 font-medium">
                                        {item.available}
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