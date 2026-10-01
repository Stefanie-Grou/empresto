import { Request, Response } from 'express';
import { acervoService } from '../services/AcervoService.js';

export class AcervoController {
  public async listar(req: Request, res: Response): Promise<void> {
    try {
      const titulo = typeof req.query.titulo === 'string' ? req.query.titulo : undefined;
      const acervo = acervoService.listar(titulo);
      res.status(200).json(acervo);
    } catch (error: any) {
      res.status(500).json({ erro: error.message || 'Erro interno ao consultar acervo.' });
    }
  }

  public async cadastrar(req: Request, res: Response): Promise<void> {
    try {
      const { titulo, tipo, autor, quantidadeTotal } = req.body;
      const resultado = acervoService.cadastrar({
        titulo,
        tipo,
        autor,
        quantidadeTotal: Number(quantidadeTotal),
      });
      res.status(201).json(resultado);
    } catch (error: any) {
      res.status(400).json({ erro: error.message || 'Erro ao cadastrar item no acervo.' });
    }
  }

  public async adicionarFila(req: Request, res: Response): Promise<void> {
    try {
      const acervoId = Number(req.params.acervoId);
      const { nomeAluno, serie } = req.body;

      if (isNaN(acervoId)) {
        res.status(400).json({ erro: 'ID do acervo inválido.' });
        return;
      }

      const resultado = acervoService.adicionarFila(acervoId, { nomeAluno, serie });
      res.status(201).json(resultado);
    } catch (error: any) {
      const status = error.statusCode || 400;
      res.status(status).json({ erro: error.message });
    }
  }
}

export const acervoController = new AcervoController();
