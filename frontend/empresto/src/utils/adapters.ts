import type { LoanItem } from '../interfaces/LoanItem';
import type { LentItem } from '../interfaces/LentItem';

export function toLentItem(loan: LoanItem): LentItem {
  return {
    id: loan.id,
    bookTitle: loan.bookTitle,
    bookAuthor: loan.bookAuthor,
    coverUrl: loan.coverUrl,
    studentName: (loan as any).userName || 'Aluno não informado',
    studentClass: (loan as any).classGroup || '-',
    dueDate: (loan as any).dueDate || '15/10/2026',
    status: (loan as any).status || 'Pendente',
  };
}