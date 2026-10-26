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
    personType: (loan as any).personType || (loan as any).tipoPessoa || (loan as any).userType,
    studentClass,
    dueDate,
    rawDueDate: (loan as any).rawDueDate,
    status,
  };
}

// Item da fila de espera (GET /api/v1/acervo/fila)
export interface WaitlistEntry {
  id: string | number;
  id_fila?: number;
  acervoId?: string | number;
  bookId?: string | number;
  bookTitle: string;
  bookAuthor: string;
  studentName: string;
  personType?: string;
  studentClass?: string;
  posicao?: number;
  requestDate?: string;
  dueDate?: string;
  status?: string;
}

export function toWaitlistLentItem(entry: WaitlistEntry): LentItem {
  return {
    id: entry.id,
    acervoId: entry.acervoId ?? entry.bookId,
    bookTitle: entry.bookTitle,
    bookAuthor: entry.bookAuthor,
    studentName: entry.studentName || 'Não informado',
    personType: entry.personType,
    studentClass: entry.studentClass || '-',
    dueDate: entry.requestDate || entry.dueDate || '-',
    status: entry.status || 'Aguardando',
  };
}