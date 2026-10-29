import { Request, Response } from 'express';
import { reportService } from '../services/ReportService.js';

export class ReportController {
  public async resumo(_req: Request, res: Response): Promise<void> {
    try {
      const resultado = await reportService.resumo();
      res.status(200).json(resultado);
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({ erro: error.message || 'Erro ao consultar os relatórios.' });
    }
  }
}

export const reportController = new ReportController();
