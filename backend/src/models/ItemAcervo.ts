export class ItemAcervo {
  id: number;
  titulo: string;
  tipo: string;
  autor?: string;
  quantidadeTotal: number;
  quantidadeDisponivel: number;

  constructor(
    id: number,
    titulo: string,
    tipo: string,
    quantidadeTotal: number,
    quantidadeDisponivel?: number,
    autor?: string
  ) {
    this.id = id;
    this.titulo = titulo;
    this.tipo = tipo;
    this.quantidadeTotal = quantidadeTotal;
    this.quantidadeDisponivel = quantidadeDisponivel !== undefined ? quantidadeDisponivel : quantidadeTotal;
    this.autor = autor;
  }
}
