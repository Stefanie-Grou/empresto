import type { InventoryItem } from '../interfaces/InventoryItem';

// Contrato esperado pela API para POST / PUT
export interface InventoryPayload {
  titulo: string;
  tipo: string;
  autor: string;
  quantidadeTotal: number;
}

// Converte a interface do React para o formato aceito pela API
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
  // POST - Criar novo item
  async create(itemData: Omit<InventoryItem, 'id' | 'available'>) {
    const payload = toInventoryPayload(itemData);
    const response = await fetch('/api/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Erro ao cadastrar item');
    return response.json();
  },

  // PUT - Atualizar item existente
  async update(id: string | number, itemData: Omit<InventoryItem, 'id' | 'available'>) {
    const payload = toInventoryPayload(itemData);
    const response = await fetch(`/api/inventory/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Erro ao atualizar item');
    return response.json();
  },

  // DELETE - Deleção lógica do item
  async delete(id: string | number) {
    const response = await fetch(`/api/inventory/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao excluir item');
    return response.json();
  },
};