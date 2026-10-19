import type { LentItem } from '../interfaces/LentItem';

export interface LoanPayload {
  nomeAluno: string;
  tipoPessoa?: string;
  turma?: string;
  livroId: number;
  prazoDevolucao: string;
}

export interface UpdateLoanPayload {
  nomeAluno?: string;
  tipoPessoa?: string;
  turma?: string;
  livroId?: number;
  prazoDevolucao?: string;
  status?: string;
}

const BASE_URL = 'http://localhost:8080/api/v1/emprestimos';

async function handleResponse(response: Response, defaultError: string) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.erro || errorData?.mensagem || defaultError);
  }
  return response.json();
}

export const loanService = {
  async getAll(search?: string, status?: string): Promise<LentItem[]> {
    const params = new URLSearchParams();
    if (search && search.trim()) params.append('busca', search.trim());
    if (status && status !== 'all') params.append('status', status.trim());

    const url = params.toString() ? `${BASE_URL}?${params.toString()}` : BASE_URL;
    const response = await fetch(url);
    const data = await handleResponse(response, 'Erro ao carregar empréstimos');

    return data.map((item: any) => ({
      id: item.id_emprestimo ?? item.id,
      bookId: item.bookId ?? item.id_livro,
      bookTitle: item.bookTitle ?? item.livro_titulo,
      bookAuthor: item.bookAuthor ?? item.livro_autor,
      coverUrl: item.coverUrl,
      studentName: item.studentName ?? item.pessoa_nome,
      personType: item.personType ?? item.tipoPessoa ?? item.pessoa_tipo ?? item.tipo_pessoa ?? 'Aluno',
      studentClass: item.studentClass ?? item.pessoa_turma ?? '',
      borrowDate: item.borrowDate,
      dueDate: item.dueDate,
      rawDueDate: item.rawDueDate,
      status: item.status || 'Pendente',
    }));
  },

  async create(payload: LoanPayload) {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(response, 'Erro ao cadastrar empréstimo');
  },

  async update(id: string | number, payload: UpdateLoanPayload) {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(response, 'Erro ao atualizar empréstimo');
  },

  async renew(id: string | number, dias = 7) {
    const response = await fetch(`${BASE_URL}/${id}/renovar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dias }),
    });
    return handleResponse(response, 'Erro ao renovar empréstimo');
  },

  async returnLoan(id: string | number) {
    const response = await fetch(`${BASE_URL}/${id}/devolucao`, {
      method: 'PUT',
    });
    return handleResponse(response, 'Erro ao registrar devolução');
  },

  async delete(id: string | number) {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response, 'Erro ao excluir empréstimo');
  },
};
