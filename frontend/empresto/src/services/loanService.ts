import type { LentItem } from '../interfaces/LentItem';
import { ENDPOINTS } from './apiConfig';
import { toast } from './toastStore';
import { throwApiError, errorMessage } from './apiError';

// Contrato do backend (NovoEmprestimoDTO / AtualizarEmprestimoDTO):
// nomeAluno, turma, livroId, prazoDevolucao
export interface LoanPayload {
  nomeAluno: string;
  turma: string;
  livroId: number;
  prazoDevolucao: string;
}

// Mantido como alias para não quebrar importações existentes
export type UpdateLoanPayload = LoanPayload;

export interface DeleteLoanPayload {
  id: number | string;
}

function formatDateToISO(dateStr: string): string {
  if (!dateStr) return '';
  if (dateStr.includes('-')) return dateStr;
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return dateStr;
}

function notifyError(title: string, error: unknown, fallback: string) {
  toast.error(title, errorMessage(error, fallback));
}

export function addDaysToDate(dateStr: string, days: number = 7): string {
  let date: Date;

  if (dateStr.includes('/')) {
    const [day, month, year] = dateStr.split('/').map(Number);
    date = new Date(year, month - 1, day);
  } else if (dateStr.includes('-')) {
    const [year, month, day] = dateStr.split('-').map(Number);
    date = new Date(year, month - 1, day);
  } else {
    date = new Date();
  }

  date.setDate(date.getDate() + days);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function toUpdateLoanPayload(item: LentItem, isRenew: boolean = false): LoanPayload {
  const targetDate = isRenew ? addDaysToDate(item.dueDate, 7) : formatDateToISO(item.dueDate);

  return {
    nomeAluno: item.studentName.trim(),
    turma: (item.studentClass || '').trim(),
    livroId: Number(item.acervoId ?? item.id),
    prazoDevolucao: targetDate,
  };
}

export const loanService = {
  async create(data: { acervoId: number; studentName: string; studentClass: string; dueDate: string }) {
    const payload: LoanPayload = {
      nomeAluno: data.studentName.trim(),
      turma: data.studentClass.trim(),
      livroId: Number(data.acervoId),
      prazoDevolucao: formatDateToISO(data.dueDate),
    };

    try {
      const response = await fetch(ENDPOINTS.LOANS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        await throwApiError(response, 'Não foi possível registrar o empréstimo.');
      }

      toast.success('Empréstimo registrado', 'O novo empréstimo foi cadastrado com sucesso.');
      return response.json();
    } catch (error) {
      notifyError('Erro ao registrar empréstimo', error, 'Não foi possível registrar o empréstimo.');
      throw error;
    }
  },

  async getAll(): Promise<unknown[]> {
    try {
      const response = await fetch(ENDPOINTS.LOANS);

      if (!response.ok) {
        await throwApiError(response, 'Não foi possível carregar os empréstimos.');
      }

      return await response.json();
    } catch (error) {
      notifyError('Erro ao carregar empréstimos', error, 'Não foi possível carregar os empréstimos.');
      throw error;
    }
  },

  async update(id: string | number, data: LentItem) {
    const payload = toUpdateLoanPayload(data, false);
    const url = `${ENDPOINTS.LOANS}/${id}`;

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        await throwApiError(response, 'Não foi possível atualizar o empréstimo.');
      }

      toast.success('Empréstimo atualizado', 'As alterações do empréstimo foram salvas com sucesso.');
      return response.json();
    } catch (error) {
      notifyError('Erro ao atualizar empréstimo', error, 'Não foi possível atualizar o empréstimo.');
      throw error;
    }
  },

  async renew(id: string | number, data: LentItem) {
    const payload = toUpdateLoanPayload(data, true);
    const url = `${ENDPOINTS.LOANS}/${id}/renovar`;

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        await throwApiError(response, 'Não foi possível renovar o empréstimo.');
      }

      toast.success('Empréstimo renovado', 'O prazo de devolução foi estendido com sucesso.');
      return response.json();
    } catch (error) {
      notifyError('Erro ao renovar empréstimo', error, 'Não foi possível renovar o empréstimo.');
      throw error;
    }
  },

  async delete(id: string | number) {
    const url = `${ENDPOINTS.LOANS}/${id}/devolucao`;

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        await throwApiError(response, 'Não foi possível registrar a devolução.');
      }

      toast.success('Devolução registrada', 'O empréstimo foi baixado com sucesso.');

      if (response.status === 204) return null;

      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } catch (error) {
      notifyError('Erro ao registrar devolução', error, 'Não foi possível registrar a devolução.');
      throw error;
    }
  },
};
