import type { LoanItem } from "../interfaces/LoanItem";

export const MOCK_LOANS: LoanItem[] = [
  {
    id: '1',
    bookTitle: 'O Auto da Compadecida',
    bookAuthor: 'Ariano Suassuna',
    userName: 'Ana Martins',
    classGroup: '7B',
    userType: 'Aluno',
    dueDate: '10/09/2026',
    itemType: 'Livro'

  },
  {
    id: '2',
    bookTitle: 'Turma da Mônica Jovem...',
    bookAuthor: 'Maurício de Sousa',
    userName: 'Renato Dias',
    classGroup: '-',
    userType: 'Professor',
    dueDate: '11/09/2026',
    itemType: 'Quadrinho'
  },
  {
    id: '3',
    bookTitle: 'A Hipótese do Amor',
    bookAuthor: 'Ali Hazelwood',
    userName: 'Lucas Gomes',
    classGroup: '7B',
    userType: 'Aluno',
    dueDate: '15/09/2026',
    itemType: 'Livro'
  },
  {
    id: '4',
    bookTitle: 'A morte de Ivan Ilitch ',
    bookAuthor: 'Liev Tolstói',
    userName: 'Mariano Gomes',
    classGroup: '9B',
    userType: 'Aluno',
    dueDate: '15/09/2026',
    itemType: 'Livro'
  },
  {
    id: '5',
    bookTitle: 'Coraline',
    bookAuthor: 'Neil Gaiman',
    userName: 'Analice Rodrigues',
    classGroup: '8B',
    userType: 'Aluno',
    dueDate: '15/09/2026',
    itemType: 'Livro'
  },{
    id: '6',
    bookTitle: 'Biologia de Campbell',
    bookAuthor: 'Andrew Reece',
    userName: 'Elisângela Roberta',
    classGroup: '-',
    userType: 'Aluno',
    dueDate: '15/09/2026',
    itemType: 'Livro'
  },
];