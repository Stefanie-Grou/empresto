import { db } from '../repositories/Database.js';

export interface NovoItemDTO {
  titulo: string;
  tipo: string;
  autor?: string;
  quantidadeTotal: number;
}

export interface FilaEsperaDTO {
  nomeAluno: string;
  serie: string;
}

export class AcervoService {
  public listar(titulo?: string) {
    const itens = db.findAllItens(titulo);
    return itens.map((item) => ({
      id: item.id,
      titulo: item.titulo,
      tipo: item.tipo,
      quantidadeTotal: item.quantidadeTotal,
      quantidadeDisponivel: item.quantidadeDisponivel,
    }));
  }

  public cadastrar(dados: NovoItemDTO) {
    if (!dados.titulo || !dados.tipo || dados.quantidadeTotal === undefined || dados.quantidadeTotal < 1) {
      throw new Error('Dados inválidos. Título, tipo e quantidadeTotal positiva são obrigatórios.');
    }

    const novoItem = db.saveItem({
      titulo: dados.titulo.trim(),
      tipo: dados.tipo.trim(),
      autor: dados.autor?.trim(),
      quantidadeTotal: Number(dados.quantidadeTotal),
    });

    return {
      id: novoItem.id,
      mensagem: 'Item cadastrado com sucesso!',
    };
  }

  public adicionarFila(acervoId: number, dados: FilaEsperaDTO) {
    const item = db.findItemById(acervoId);
    if (!item) {
      const error: any = new Error('Item do acervo não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    if (item.quantidadeDisponivel > 0) {
      const error: any = new Error('Existem exemplares disponíveis na estante. Não é permitido entrar na fila.');
      error.statusCode = 400;
      throw error;
    }

    if (!dados.nomeAluno || !dados.serie) {
      const error: any = new Error('Nome do aluno e série são obrigatórios.');
      error.statusCode = 400;
      throw error;
    }

    const fila = db.addToFila(acervoId, dados.nomeAluno.trim(), dados.serie.trim());

    return {
      posicaoFila: fila.posicao,
      mensagem: 'Aluno adicionado à fila de espera.',
    };
  }
}

export const acervoService = new AcervoService();
