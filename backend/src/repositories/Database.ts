import { ItemAcervo } from '../models/ItemAcervo.js';
import { Emprestimo } from '../models/Emprestimo.js';
import { FilaEspera } from '../models/FilaEspera.js';

class InMemoryDatabase {
  private itens: ItemAcervo[] = [
    new ItemAcervo(1, 'História do Brasil', 'Livro Didático', 5, 3, 'Boris Fausto'),
    new ItemAcervo(2, 'Revista Pesquisa FAPESP', 'Revista', 2, 0, 'Vários'),
    new ItemAcervo(3, 'Dom Casmurro', 'Literatura', 4, 4, 'Machado de Assis'),
  ];

  private emprestimos: Emprestimo[] = [
    new Emprestimo(1, 1, 'Mariana Costa', '7º Ano B', '2026-09-30', 'ATIVO', '2026-09-15'),
    new Emprestimo(2, 1, 'Lucas Mendes', '8º Ano A', '2026-09-28', 'ATIVO', '2026-09-14'),
  ];

  private filasEspera: FilaEspera[] = [];

  private nextItemId = 4;
  private nextEmprestimoId = 3;
  private nextFilaId = 1;

  public findAllItens(titulo?: string): ItemAcervo[] {
    if (!titulo) {
      return [...this.itens];
    }
    const termo = titulo.toLowerCase();
    return this.itens.filter((item) =>
      item.titulo.toLowerCase().includes(termo)
    );
  }

  public findItemById(id: number): ItemAcervo | undefined {
    return this.itens.find((item) => item.id === id);
  }

  public saveItem(item: Omit<ItemAcervo, 'id' | 'quantidadeDisponivel'>): ItemAcervo {
    const newItem = new ItemAcervo(
      this.nextItemId++,
      item.titulo,
      item.tipo,
      item.quantidadeTotal,
      item.quantidadeTotal,
      item.autor
    );
    this.itens.push(newItem);
    return newItem;
  }

  public updateItem(item: ItemAcervo): ItemAcervo {
    const index = this.itens.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      this.itens[index] = item;
    }
    return item;
  }

  public findEmprestimoById(id: number): Emprestimo | undefined {
    return this.emprestimos.find((e) => e.id === id);
  }

  public saveEmprestimo(
    acervoId: number,
    nomeAluno: string,
    serie: string,
    dataDevolucaoPrevista: string
  ): Emprestimo {
    const novoEmprestimo = new Emprestimo(
      this.nextEmprestimoId++,
      acervoId,
      nomeAluno,
      serie,
      dataDevolucaoPrevista
    );
    this.emprestimos.push(novoEmprestimo);
    return novoEmprestimo;
  }

  public updateEmprestimo(emprestimo: Emprestimo): Emprestimo {
    const index = this.emprestimos.findIndex((e) => e.id === emprestimo.id);
    if (index !== -1) {
      this.emprestimos[index] = emprestimo;
    }
    return emprestimo;
  }

  public getFilaByAcervoId(acervoId: number): FilaEspera[] {
    return this.filasEspera
      .filter((f) => f.acervoId === acervoId)
      .sort((a, b) => a.posicao - b.posicao);
  }

  public addToFila(acervoId: number, nomeAluno: string, serie: string): FilaEspera {
    const filaAtual = this.getFilaByAcervoId(acervoId);
    const proximaPosicao = filaAtual.length + 1;

    const novaEntrada = new FilaEspera(
      this.nextFilaId++,
      acervoId,
      nomeAluno,
      serie,
      proximaPosicao
    );

    this.filasEspera.push(novaEntrada);
    return novaEntrada;
  }
}

export const db = new InMemoryDatabase();
