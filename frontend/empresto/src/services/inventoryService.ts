import type { InventoryItem } from '../interfaces/InventoryItem';
import { ENDPOINTS } from './apiConfig';
import type { BookOption } from '../interfaces/BookOption';
import { MOCK_LOANS } from '../mocks/mock_loans'; 
import { type WaitlistResponse, type WaitlistPayload } from '../interfaces/WaitlistPayload';

export interface InventoryPayload {
  titulo: string;
  tipo: string;
  autor: string;
  quantidadeTotal: number;
}

export interface RemoveWaitlistPayload {
  studentName: string;
  studentClass?: string;
}

export function toInventoryPayload(data: Omit<InventoryItem, 'id' | 'available'>): InventoryPayload {
  return {
    titulo: data.bookTitle,
    tipo: data.itemType,
    autor: data.bookAuthor,
    quantidadeTotal: data.quantity,
  };
}

const USE_MOCK = true;

export const inventoryService = {
  async create(itemData: Omit<InventoryItem, 'id' | 'available'>) {
    if (USE_MOCK) {
      return Promise.resolve({ success: true, ...itemData });
    }

    const payload = toInventoryPayload(itemData);
    const url = ENDPOINTS.INVENTORY;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Erro ao cadastrar item no acervo');
    return response.json();
  },

  async update(id: string | number, itemData: Omit<InventoryItem, 'id' | 'available'>) {
    if (USE_MOCK) {
      return Promise.resolve({ success: true, id, ...itemData });
    }

    const payload = toInventoryPayload(itemData);
    const url = `${ENDPOINTS.INVENTORY}/${id}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Erro ao atualizar item do acervo');
    return response.json();
  },

  async delete(id: string | number) {
    if (USE_MOCK) {
      return Promise.resolve({ success: true, id });
    }

    const url = `${ENDPOINTS.INVENTORY}/${id}`;

    const response = await fetch(url, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Erro ao excluir item do acervo');
    return response.json();
  },

  async searchBooks(query: string): Promise<BookOption[]> {
    if (USE_MOCK) {
      const term = query.toLowerCase().trim();

      const results = MOCK_LOANS.map<BookOption>((item) => ({
        id: item.id,
        bookTitle: item.bookTitle,
        bookAuthor: item.bookAuthor,
        itemType: item.itemType || 'Livro',
      })).filter(
        (book) =>
          !term ||
          book.bookTitle.toLowerCase().includes(term) ||
          book.bookAuthor.toLowerCase().includes(term)
      );

      const uniqueBooks = Array.from(
        new Map(results.map((item) => [item.bookTitle, item])).values()
      );

      return Promise.resolve(uniqueBooks);
    } else {
      const response = await fetch(`/api/v1/acervos/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Erro ao buscar acervo');
      return response.json();
    }
  },
  async addToWaitlist(acervoId: string | number, payload: WaitlistResponse) {
    const url = `${ENDPOINTS.INVENTORY}/${acervoId}/fila`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Erro ao adicionar aluno à fila de espera.');
    }

    return response.json();
  },

  async removeFromWaitlist(acervoId: string | number, payload: RemoveWaitlistPayload) {

    const url = `${ENDPOINTS.INVENTORY}/${acervoId}/fila`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Erro ao remover aluno da fila de espera.');
    }

    return response.json();
  },

  async updateWaitlist(acervoId: string | number, payload: WaitlistPayload) {
    const url = `${ENDPOINTS.INVENTORY}/${acervoId}/fila`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar a reserva na fila de espera.');
    }

    return response.json();
  },
};