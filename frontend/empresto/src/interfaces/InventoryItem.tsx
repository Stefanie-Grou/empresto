export interface InventoryItem {
  id: string | number;
  bookTitle: string;
  bookAuthor: string;
  coverUrl?: string;
  itemType: string; // Ex: 'Livro', 'Quadrinho'
  quantity: number;
  available: number;
}