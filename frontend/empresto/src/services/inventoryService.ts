import type { InventoryItem } from '../interfaces/InventoryItem';

export interface InventoryPayload {
  titulo: string;
  tipo: string;
  autor: string;
  quantidadeTotal: number;
}

const BASE_URL = 'http://localhost:8080/api/v1/acervo';

async function handleResponse(response: Response, defaultError: string) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.erro || errorData?.mensagem || defaultError);
  }
  return response.json();
}

export function toInventoryPayload(data: Omit<InventoryItem, 'id' | 'available'>): InventoryPayload {
  return {
    titulo: data.bookTitle,
    tipo: data.itemType,
    autor: data.bookAuthor,
    quantidadeTotal: data.quantity,
  };
}

export const inventoryService = {
  async getAll(search?: string): Promise<InventoryItem[]> {
    const url = search && search.trim()
      ? `${BASE_URL}?busca=${encodeURIComponent(search.trim())}`
      : BASE_URL;
    const response = await fetch(url);
    const data = await handleResponse(response, 'Erro ao carregar itens do acervo');
    return data.map((item: any) => ({
      id: item.id_livro ?? item.id,
      bookTitle: item.titulo ?? item.bookTitle,
      bookAuthor: item.autor ?? item.bookAuthor,
      coverUrl: item.coverUrl,
      itemType: item.genero ?? item.tipo ?? item.itemType ?? 'Livro',
      quantity: Number(item.quantidade_exemplares ?? item.quantidadeTotal ?? item.quantity ?? 1),
      available: Number(item.quantidade_disponivel ?? item.quantidadeDisponivel ?? item.available ?? 0),
    }));
  },

  async create(itemData: Omit<InventoryItem, 'id' | 'available'>) {
    const payload = toInventoryPayload(itemData);
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(response, 'Erro ao cadastrar item');
  },

  async update(id: string | number, itemData: Omit<InventoryItem, 'id' | 'available'>) {
    const payload = toInventoryPayload(itemData);
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(response, 'Erro ao atualizar item');
  },

  async delete(id: string | number) {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response, 'Erro ao excluir item');
  },
};