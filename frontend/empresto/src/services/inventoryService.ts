import type { InventoryItem } from '../interfaces/InventoryItem';
import { ENDPOINTS } from './apiConfig';
import type { BookOption } from '../interfaces/BookOption';
import { MOCK_LOANS } from '../mocks/mock_loans'; 
import { type WaitlistResponse } from '../interfaces/WaitlistPayload';

// Contrato esperado pela API para POST / PUT
export interface InventoryPayload {
  titulo: string;
  tipo: string;
  autor: string;
  quantidadeTotal: number;
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

// Operações HTTP respeitando os verbos REST
export const inventoryService = {
  // POST - Criar novo item no acervo
  async create(itemData: Omit<InventoryItem, 'id' | 'available'>) {
    if (USE_MOCK) {
      console.log('[MOCK POST] Criando item no acervo localmente:', itemData);
      return Promise.resolve({ success: true, ...itemData });
    }

    const payload = toInventoryPayload(itemData);
    const url = ENDPOINTS.INVENTORY;

    console.log(`[POST] Enviando requisição para: ${url}`, payload);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Erro ao cadastrar item no acervo');
    return response.json();
  },

  // PUT - Atualizar item existente no acervo
  async update(id: string | number, itemData: Omit<InventoryItem, 'id' | 'available'>) {
    if (USE_MOCK) {
      console.log(`[MOCK PUT] Atualizando item ${id} localmente:`, itemData);
      return Promise.resolve({ success: true, id, ...itemData });
    }

    const payload = toInventoryPayload(itemData);
    const url = `${ENDPOINTS.INVENTORY}/${id}`;

    console.log(`[PUT] Enviando requisição para: ${url}`, payload);

    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Erro ao atualizar item do acervo');
    return response.json();
  },

  // DELETE - Deleção do item
  async delete(id: string | number) {
    if (USE_MOCK) {
      console.log(`[MOCK DELETE] Removendo item ${id} localmente`);
      return Promise.resolve({ success: true, id });
    }

    const url = `${ENDPOINTS.INVENTORY}/${id}`;

    console.log(`[DELETE] Enviando requisição para: ${url}`);

    const response = await fetch(url, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Erro ao excluir item do acervo');
    return response.json();
  },

  // SEARCH - Busca de livros para reservas e formulários
  async searchBooks(query: string): Promise<BookOption[]> {
    if (USE_MOCK) {
      const term = query.toLowerCase().trim();

      const results = MOCK_LOANS.map((item) => ({
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

      // Remove duplicados pelo título do livro
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
};