import { useState, useMemo } from 'react';

interface UsePaginatedSearchOptions<T> {
  items: T[];
  searchPredicate: (item: T, term: string) => boolean;
  itemsPerPage?: number;
}

export function usePaginatedSearch<T>({
  items,
  searchPredicate,
  itemsPerPage = 5,
}: UsePaginatedSearchOptions<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredItems = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return items;

    return items.filter((item) => searchPredicate(item, term));
  }, [items, searchTerm, searchPredicate]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;

  const paginatedItems = useMemo(() => {
    return filteredItems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredItems, currentPage, itemsPerPage]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return {
    searchTerm,
    currentPage,
    totalPages,
    filteredItems,
    paginatedItems,
    handleSearchChange,
    setCurrentPage,
    setSearchTerm,
  };
}