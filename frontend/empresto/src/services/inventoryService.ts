import type { InventoryItem } from '../interfaces/InventoryItem';
import { ENDPOINTS } from './apiConfig';
import type { BookOption } from '../interfaces/BookOption';
import type { WaitlistEntry } from '../utils/adapters';
import { type WaitlistPayload } from '../interfaces/WaitlistPayload';
import { toast } from './toastStore';
import { throwApiError, errorMessage } from './apiError';

export interface InventoryPayload {
  titulo: string;
  tipo: string;
  autor: string;
  quantidadeTotal: number;
}

export interface RemoveWaitlistPayload {
  nomeAluno: string;
  serie?: string;
  tipoPessoa?: string;
}

export type UpdateWaitlistPayload = WaitlistPayload;

export function toInventoryPayload(data: Omit<InventoryItem, 'id' | 'available'>): InventoryPayload {
  return {
    titulo: data.bookTitle,
    tipo: data.itemType,
    autor: data.bookAuthor,
    quantidadeTotal: data.quantity,
  };
}

function notifyError(title: string, error: unknown, fallback: string) {
  toast.error(title, errorMessage(error, fallback));
}

export const inventoryService = {
  async create(itemData: Omit<InventoryItem, 'id' | 'available'>) {
    const payload = toInventoryPayload(itemData);
    const url = ENDPOINTS.INVENTORY;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        await throwApiError(response, 'Não foi possível cadastrar o item no acervo.');
      }

      toast.success('Item cadastrado', 'Novo exemplar adicionado ao acervo com sucesso.');
      return response.json();
    } catch (error) {
      notifyError('Erro ao cadastrar', error, 'Não foi possível cadastrar o item no acervo.');
      throw error;
    }
  },

  async update(id: string | number, itemData: Omit<InventoryItem, 'id' | 'available'>) {
    const payload = toInventoryPayload(itemData);
    const url = `${ENDPOINTS.INVENTORY}/${id}`;

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        await throwApiError(response, 'Não foi possível atualizar o item do acervo.');
      }

      toast.success('Item atualizado', 'As alterações do item foram salvas com sucesso.');
      return response.json();
    } catch (error) {
      notifyError('Erro ao atualizar', error, 'Não foi possível atualizar o item do acervo.');
      throw error;
    }
  },

  async delete(id: string | number) {
    const url = `${ENDPOINTS.INVENTORY}/${id}`;

    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (!response.ok) {
        await throwApiError(response, 'Não foi possível remover o item do acervo.');
      }

      toast.success('Item removido', 'O exemplar foi removido do acervo com sucesso.');
      return response.json();
    } catch (error) {
      notifyError('Erro ao remover', error, 'Não foi possível remover o item do acervo.');
      throw error;
    }
  },

  async getAll(): Promise<InventoryItem[]> {
    const url = ENDPOINTS.INVENTORY;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        await throwApiError(response, 'Não foi possível carregar os itens do acervo.');
      }

      return await response.json();
    } catch (error) {
      notifyError('Erro ao carregar acervo', error, 'Não foi possível carregar os itens do acervo.');
      throw error;
    }
  },

  async searchBooks(query: string): Promise<BookOption[]> {
    const url = `${ENDPOINTS.INVENTORY}?busca=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        await throwApiError(response, 'Não foi possível buscar os livros do acervo.');
      }

      const data: BookOption[] = await response.json();

      const options = data.map((book) => ({
        id: book.id,
        bookTitle: book.bookTitle,
        bookAuthor: book.bookAuthor,
        itemType: book.itemType,
        available: book.available,
      }));

      return Array.from(new Map(options.map((book) => [book.bookTitle, book])).values());
    } catch (error) {
      notifyError('Erro ao buscar livros', error, 'Não foi possível buscar os livros do acervo.');
      throw error;
    }
  },

  async getWaitlist(): Promise<WaitlistEntry[]> {
    const url = `${ENDPOINTS.INVENTORY}/fila`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        await throwApiError(response, 'Não foi possível carregar a fila de espera.');
      }

      return await response.json();
    } catch (error) {
      notifyError('Erro ao carregar reservas', error, 'Não foi possível carregar a fila de espera.');
      throw error;
    }
  },

  async addToWaitlist(acervoId: string | number, payload: WaitlistPayload) {
    const url = `${ENDPOINTS.INVENTORY}/${acervoId}/fila`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        await throwApiError(response, 'Não foi possível adicionar à fila de espera.');
      }

      toast.success('Reserva cadastrada', 'Adicionado à fila de espera com sucesso.');
      return response.json();
    } catch (error) {
      notifyError('Erro ao reservar', error, 'Não foi possível adicionar à fila de espera.');
      throw error;
    }
  },

  async removeFromWaitlist(acervoId: string | number, payload: RemoveWaitlistPayload) {
    const url = `${ENDPOINTS.INVENTORY}/${acervoId}/fila`;

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        await throwApiError(response, 'Não foi possível remover da fila de espera.');
      }

      toast.success('Reserva removida', 'Removido da fila de espera com sucesso.');
      return response.json();
    } catch (error) {
      notifyError('Erro ao remover da fila', error, 'Não foi possível remover da fila de espera.');
      throw error;
    }
  },

  async updateWaitlist(acervoId: string | number, payload: WaitlistPayload) {
    const url = `${ENDPOINTS.INVENTORY}/${acervoId}/fila`;

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        await throwApiError(response, 'Não foi possível atualizar os dados da reserva.');
      }

      toast.success('Reserva atualizada', 'Os dados da reserva foram salvos com sucesso.');
      return response.json();
    } catch (error) {
      notifyError('Erro ao atualizar reserva', error, 'Não foi possível atualizar os dados da reserva.');
      throw error;
    }
  },
};
