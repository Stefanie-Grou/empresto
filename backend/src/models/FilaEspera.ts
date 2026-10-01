export class FilaEspera {
  id: number;
  acervoId: number;
  nomeAluno: string;
  serie: string;
  posicao: number;
  dataRegistro: string;

  constructor(
    id: number,
    acervoId: number,
    nomeAluno: string,
    serie: string,
    posicao: number,
    dataRegistro: string = new Date().toISOString()
  ) {
    this.id = id;
    this.acervoId = acervoId;
    this.nomeAluno = nomeAluno;
    this.serie = serie;
    this.posicao = posicao;
    this.dataRegistro = dataRegistro;
  }
}
