export interface LoanItem {
  id: string;
  acervoId?: string | number;
  bookTitle: string;
  bookAuthor: string;
  coverUrl?: string;
  userName: string;
  classGroup?: string;
  userType: 'Aluno' | 'Professor' | string;
  dueDate: string;
  itemType: string;
}