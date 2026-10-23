import type { LentItem } from '../interfaces/LentItem';
import { ENDPOINTS } from './apiConfig';

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
    const payload: CreateLoanPayload = {
      acervoId: Number(data.acervoId),
      nomeAluno: data.studentName.trim(),
      serie: data.studentClass.trim(),
      dataDevolucaoPrevista: formatDateToISO(data.dueDate),
    };

    const response = await fetch(ENDPOINTS.LOANS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Erro ao registrar novo empréstimo');
    return response.json();
  },

  async update(id: string | number, data: LentItem) {
    const payload = toUpdateLoanPayload(data, false);
    const url = `${ENDPOINTS.LOANS}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Erro ao atualizar registro de empréstimo');
    return response.json();
  },

  async renew(id: string | number, data: LentItem) {
    const payload = toUpdateLoanPayload(data, true);
    const url = `${ENDPOINTS.LOANS}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Erro ao renovar empréstimo');
    return response.json();
  },

  async delete(id: string | number) {
    const url = `${ENDPOINTS.LOANS}/${id}/devolucao`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao remover registro de empréstimo');
    }

    return response.json();
  },
};