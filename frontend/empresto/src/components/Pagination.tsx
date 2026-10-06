import { Icon } from '@iconify/react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPaginationRange(currentPage: number, totalPages: number) {
  const delta = 1; 
  const range: (number | string)[] = [];

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      range.push(i);
    } else if (
      (i === currentPage - delta - 1 && i > 1) ||
      (i === currentPage + delta + 1 && i < totalPages)
    ) {
      range.push('...');
    }
  }

  return range.filter((item, index, array) => item !== '...' || array[index - 1] !== '...');
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPaginationRange(currentPage, totalPages);

  return (
    <div className="flex items-center justify-center gap-1 pt-6 text-sm text-emerald-900 font-medium">
      {/* Botão Anterior */}
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-1 hover:text-emerald-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
        title="Página anterior"
      >
        <Icon icon="lucide:chevron-left" className="w-4 h-4" />
      </button>

      {pages.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="px-2 text-gray-400 select-none">
              ...
            </span>
          );
        }

        const pageNum = page as number;
        const isActive = pageNum === currentPage;

        return (
          <button
            key={pageNum}
            type="button"
            onClick={() => onPageChange(pageNum)}
            className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
              isActive
                ? 'bg-emerald-100/80 text-emerald-900'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
            }`}
          >
            {pageNum}
          </button>
        );
      })}

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-1 hover:text-emerald-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
        title="Próxima página"
      >
        <Icon icon="lucide:chevron-right" className="w-4 h-4" />
      </button>
    </div>
  );
}