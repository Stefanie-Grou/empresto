import type { LoanItem } from '../interfaces/LoanItem';
import type { LentItem } from '../interfaces/LentItem';

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;

  if (dateStr.includes('/')) {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  return null;
}

function calculateStatus(dueDateStr: string, currentStatus?: string): string {
  if (currentStatus && currentStatus.toLowerCase() === 'devolvido') {
    return 'Devolvido';
  }

  const dueDate = parseDate(dueDateStr);
  if (!dueDate) return currentStatus || 'Pendente';

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  if (dueDate < today) {
    return 'Atrasado';
  }

  return 'Pendente';
}

export function toLentItem(loan: LoanItem): LentItem {
  const studentName = (loan as any).studentName || (loan as any).userName || 'Não informado';
  const studentClass = (loan as any).studentClass || (loan as any).classGroup || '-';
  const dueDate = (loan as any).dueDate || '15/10/2026';
  
  const status = calculateStatus(dueDate, (loan as any).status);

  return {
    id: loan.id,
    acervoId: loan.acervoId,
    bookTitle: loan.bookTitle,
    bookAuthor: loan.bookAuthor,
    coverUrl: loan.coverUrl,
    studentName,
    studentClass,
    dueDate,
    status,
  };
}