export interface LoanItem {
  id: string;
  bookTitle: string;
  bookAuthor: string;
  coverUrl?: string;
  userName: string;
  userAvatar?: string;
  classGroup?: string;
  userType: 'Aluno' | 'Professor' | string;
  dueDate: string;
}