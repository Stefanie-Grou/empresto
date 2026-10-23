import type { LentItem } from '../interfaces/LentItem';
import { ENDPOINTS } from './apiConfig';
import { toast } from './toastStore';

export interface UpdateLoanPayload {
  acervoId: number;
  nomeAluno: string;
  serie: string;
  dataDevolucaoPrevista: string;
}

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
  toast.error(title, error instanceof Error && error.message ? error.message : fallback);
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

export function toUpdateLoanPayload(item: LentItem, isRenew: boolean = false): UpdateLoanPayload {
  const targetDate = isRenew ? addDaysToDate(item.dueDate, 7) : formatDateToISO(item.dueDate);

  return {
    acervoId: Number(item.id),
    nomeAluno: item.studentName.trim(),
    serie: item.studentClass.trim(),
    dataDevolucaoPrevista: targetDate,
  };
}

export const loanService = {
  async create(data: { acervoId: number; studentName: string; studentClass: string; dueDate: string }) {
    const payload: UpdateLoanPayload = {
      acervoId: Number(data.acervoId),
      nomeAluno: data.studentName.trim(),
      serie: data.studentClass.trim(),
      dataDevolucaoPrevista: formatDateToISO(data.dueDate),
    };

    try {
      const response = await fetch(ENDPOINTS.LOANS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Erro ao registrar novo empréstimo');

      toast.success('Empréstimo registrado', 'O novo empréstimo foi cadastrado com sucesso.');
      return response.json();
    } catch (error) {
      notifyError('Erro ao registrar empréstimo', error, 'Não foi possível registrar o empréstimo.');
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

      if (!response.ok) throw new Error('Erro ao atualizar registro de empréstimo');

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

      if (!response.ok) throw new Error('Erro ao renovar empréstimo');

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
        throw new Error('Erro ao registrar a devolução do empréstimo');
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
