export interface LentItem {
  id: string | number;
  acervoId?: string | number;
  bookTitle: string;
  bookAuthor: string;
  coverUrl?: string;
  studentName: string;
  personType?: 'Aluno' | 'Professor' | 'Funcionário' | string;
  studentClass?: string; 
  dueDate: string;     
  rawDueDate?: string;
  status: 'Pendente' | 'Atrasado' | 'Devolvido' | string;
}