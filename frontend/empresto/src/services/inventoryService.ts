import type { InventoryItem } from '../interfaces/InventoryItem';
import { ENDPOINTS } from './apiConfig';
import type { BookOption } from '../interfaces/BookOption';
import { type WaitlistResponse, type WaitlistPayload } from '../interfaces/WaitlistPayload';
import { toast } from './toastStore';

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

function notifyError(title: string, error: unknown, fallback: string) {
  toast.error(title, error instanceof Error && error.message ? error.message : fallback);
}

export const inventoryService = {
  async create(itemData: Omit<InventoryItem, 'id' | 'available'>) {
    const payload = toInventoryPayload(itemData);
    const url = ENDPOINTS.INVENTORY;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = new Error('Erro ao cadastrar item no acervo');
      notifyError('Erro ao cadastrar', error, 'Não foi possível cadastrar o item no acervo.');
      throw error;
    }

    toast.success('Item cadastrado', 'Novo exemplar adicionado ao acervo com sucesso.');
    return response.json();
  },

  async update(id: string | number, itemData: Omit<InventoryItem, 'id' | 'available'>) {
    const payload = toInventoryPayload(itemData);
    const url = `${ENDPOINTS.INVENTORY}/${id}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = new Error('Erro ao atualizar item do acervo');
      notifyError('Erro ao atualizar', error, 'Não foi possível atualizar o item do acervo.');
      throw error;
    }

    toast.success('Item atualizado', 'As alterações do item foram salvas com sucesso.');
    return response.json();
  },

  async delete(id: string | number) {
    const url = `${ENDPOINTS.INVENTORY}/${id}`;

    const response = await fetch(url, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = new Error('Erro ao excluir item do acervo');
      notifyError('Erro ao remover', error, 'Não foi possível remover o item do acervo.');
      throw error;
    }

    toast.success('Item removido', 'O exemplar foi removido do acervo com sucesso.');
    return response.json();
  },

  async getAll(): Promise<InventoryItem[]> {
    const url = ENDPOINTS.INVENTORY;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Erro ao carregar acervo');
      }

      return await response.json();
    } catch (error) {
      notifyError('Erro ao carregar acervo', error, 'Não foi possível carregar os itens do acervo.');
      throw error;
    }
  },

  async searchBooks(query: string): Promise<BookOption[]> {
    const response = await fetch(`/api/v1/acervos/search?q=${encodeURIComponent(query)}`);

    if (!response.ok) {
      const error = new Error('Erro ao buscar acervo');
      notifyError('Erro ao buscar livros', error, 'Não foi possível buscar os livros do acervo.');
      throw error;
    }

    return response.json();
  },

  async addToWaitlist(acervoId: string | number, payload: WaitlistResponse) {
    const url = `${ENDPOINTS.INVENTORY}/${acervoId}/fila`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = new Error('Erro ao adicionar aluno à fila de espera.');
      notifyError('Erro ao reservar', error, 'Não foi possível adicionar o aluno à fila de espera.');
      throw error;
    }

    toast.success('Reserva cadastrada', 'O aluno entrou na fila de espera com sucesso.');
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
      const error = new Error('Erro ao remover aluno da fila de espera.');
      notifyError('Erro ao remover da fila', error, 'Não foi possível remover o aluno da fila de espera.');
      throw error;
    }

    toast.success('Reserva removida', 'O aluno foi removido da fila de espera.');
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
      const error = new Error('Erro ao atualizar a reserva na fila de espera.');
      notifyError('Erro ao atualizar reserva', error, 'Não foi possível atualizar os dados da reserva.');
      throw error;
    }

    toast.success('Reserva atualizada', 'Os dados da reserva foram salvos com sucesso.');
    return response.json();
  },
};
