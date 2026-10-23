export interface BookOption {
  id: number | string;
  bookTitle: string;
  bookAuthor: string;
  itemType?: string;
  available?: number;
}
