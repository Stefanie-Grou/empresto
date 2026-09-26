export class Emprestimo {
  id: number;
  acervoId: number;
  nomeAluno: string;
  serie: string;
  dataEmprestimo: string;
  dataDevolucaoPrevista: string;
  dataDevolucaoReal?: string;
  status: 'ATIVO' | 'DEVOLVIDO';

  constructor(
    id: number,
    acervoId: number,
    nomeAluno: string,
    serie: string,
    dataDevolucaoPrevista: string,
    status: 'ATIVO' | 'DEVOLVIDO' = 'ATIVO',
    dataEmprestimo: string = new Date().toISOString().split('T')[0]
  ) {
    this.id = id;
    this.acervoId = acervoId;
    this.nomeAluno = nomeAluno;
    this.serie = serie;
    this.dataDevolucaoPrevista = dataDevolucaoPrevista;
    this.status = status;
    this.dataEmprestimo = dataEmprestimo;
  }
}
