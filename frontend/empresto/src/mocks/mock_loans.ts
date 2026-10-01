import type { LoanItem } from "../MainElements/LoanItem";

export const MOCK_LOANS: LoanItem[] = [
  {
    id: '1',
    bookTitle: 'O Auto da Compadecida',
    bookAuthor: 'Ariano Suassuna',
    userName: 'Ana Martins',
    classGroup: '7B',
    userType: 'Aluno',
    dueDate: '10/09/2026',
  },
  {
    id: '2',
    bookTitle: 'Turma da Mônica Jovem...',
    bookAuthor: 'Maurício de Sousa',
    userName: 'Renato Dias',
    classGroup: '-',
    userType: 'Professor',
    dueDate: '11/09/2026',
  },
  {
    id: '3',
    bookTitle: 'A Hipótese do Amor',
    bookAuthor: 'Ali Hazelwood',
    userName: 'Lucas Gomes',
    classGroup: '7B',
    userType: 'Aluno',
    dueDate: '15/09/2026',
  },
];