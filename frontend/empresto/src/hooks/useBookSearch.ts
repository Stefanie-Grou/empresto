import { useState, useEffect, useCallback } from 'react';
import { inventoryService } from '../services/inventoryService';
import type { BookOption } from '../interfaces/BookOption';

interface UseBookSearchOptions {
  debounceMs?: number;
  enabled?: boolean;
}

export function useBookSearch({
  debounceMs = 200,
  enabled = true,
}: UseBookSearchOptions = {}) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<BookOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!enabled) return;

    let isCurrent = true;

    const timer = setTimeout(async () => {
      if (isCurrent) setIsLoading(true);
      try {
        const results = await inventoryService.searchBooks(query);
        if (!isCurrent) return;
        setSuggestions(results);
        setError(null);
      } catch (err) {
        if (!isCurrent) return;
        setError(err);
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }, debounceMs);

    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [query, debounceMs, enabled]);

  const reset = useCallback(() => {
    setQuery('');
    setSuggestions([]);
    setIsLoading(false);
    setError(null);
  }, []);

  return { query, setQuery, suggestions, isLoading, error, reset };
}
