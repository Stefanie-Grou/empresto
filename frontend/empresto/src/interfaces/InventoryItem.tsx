export interface InventoryItem {
  id: string | number;
  bookTitle: string;
  bookAuthor: string;
  coverUrl?: string;
  itemType: string;
  quantity: number;
  available: number;
}