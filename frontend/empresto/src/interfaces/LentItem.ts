export interface LentItem {
  id: string | number;
  bookTitle: string;
  bookAuthor: string;
  coverUrl?: string;
  studentName: string;
  personType?: 'Aluno' | 'Professor' | 'Funcionário' | string;
  studentClass?: string; 
  dueDate: string;     
  status: 'Pendente' | 'Atrasado' | 'Devolvido' | string;
}