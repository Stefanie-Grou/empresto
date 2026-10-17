import type { InventoryItem } from '../interfaces/InventoryItem';
import { ENDPOINTS } from './apiConfig';

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

// Operações HTTP respeitando os verbos REST
export const inventoryService = {
  // POST - Criar novo item no acervo
  async create(itemData: Omit<InventoryItem, 'id' | 'available'>) {
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
    const url = `${ENDPOINTS.INVENTORY}/${id}`;

    console.log(`[DELETE] Enviando requisição para: ${url}`);

    const response = await fetch(url, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Erro ao excluir item do acervo');
    return response.json();
  },
};