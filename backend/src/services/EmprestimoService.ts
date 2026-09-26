import { db } from '../repositories/Database.js';

export interface NovoEmprestimoDTO {
  acervoId: number;
  nomeAluno: string;
  serie: string;
  dataDevolucaoPrevista: string;
}

export class EmprestimoService {
  public registrar(dados: NovoEmprestimoDTO) {
    const item = db.findItemById(dados.acervoId);
    if (!item) {
      const error: any = new Error('Item do acervo não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    if (item.quantidadeDisponivel <= 0) {
      const error: any = new Error('Nenhum exemplar disponível no momento. Deseja entrar na fila de espera?');
      error.statusCode = 400;
      throw error;
    }

    if (!dados.nomeAluno || !dados.serie || !dados.dataDevolucaoPrevista) {
      const error: any = new Error('Todos os campos são obrigatórios.');
      error.statusCode = 400;
      throw error;
    }

    item.quantidadeDisponivel -= 1;
    db.updateItem(item);

    const emprestimo = db.saveEmprestimo(
      dados.acervoId,
      dados.nomeAluno.trim(),
      dados.serie.trim(),
      dados.dataDevolucaoPrevista
    );

    return {
      id: emprestimo.id,
      mensagem: 'Empréstimo registrado com sucesso!',
      emprestimo,
    };
  }

  public devolver(id: number) {
    const emprestimo = db.findEmprestimoById(id);
    if (!emprestimo) {
      const error: any = new Error('Empréstimo não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    if (emprestimo.status === 'DEVOLVIDO') {
      const error: any = new Error('Este empréstimo já foi devolvido anteriormente.');
      error.statusCode = 400;
      throw error;
    }

    emprestimo.status = 'DEVOLVIDO';
    emprestimo.dataDevolucaoReal = new Date().toISOString().split('T')[0];
    db.updateEmprestimo(emprestimo);

    const item = db.findItemById(emprestimo.acervoId);
    if (item) {
      item.quantidadeDisponivel += 1;
      db.updateItem(item);
    }

    return {
      mensagem: 'Devolução registrada com sucesso.',
    };
  }
}

export const emprestimoService = new EmprestimoService();
