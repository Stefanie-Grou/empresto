import { Request, Response } from 'express';
import { emprestimoService } from '../services/EmprestimoService.js';

export class EmprestimoController {
  public async registrar(req: Request, res: Response): Promise<void> {
    try {
      const { acervoId, nomeAluno, serie, dataDevolucaoPrevista } = req.body;

      if (!acervoId) {
        res.status(400).json({ erro: 'O campo acervoId é obrigatório.' });
        return;
      }

      const resultado = emprestimoService.registrar({
        acervoId: Number(acervoId),
        nomeAluno,
        serie,
        dataDevolucaoPrevista,
      });

      res.status(201).json(resultado);
    } catch (error: any) {
      const status = error.statusCode || 400;
      res.status(status).json({ erro: error.message });
    }
  }

  public async devolver(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ erro: 'ID do empréstimo inválido.' });
        return;
      }

      const resultado = emprestimoService.devolver(id);
      res.status(200).json(resultado);
    } catch (error: any) {
      const status = error.statusCode || 400;
      res.status(status).json({ erro: error.message });
    }
  }
}

export const emprestimoController = new EmprestimoController();
