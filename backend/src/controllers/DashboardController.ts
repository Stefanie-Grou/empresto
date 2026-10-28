import { Request, Response } from 'express';
import { dashboardService } from '../services/DashboardService.js';

export class DashboardController {
  public async resumo(req: Request, res: Response): Promise<void> {
    try {
      const hoje = typeof req.query.hoje === 'string' ? req.query.hoje : undefined;
      const resultado = await dashboardService.resumo(hoje);
      res.status(200).json(resultado);
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({ erro: error.message || 'Erro ao consultar o resumo do dashboard.' });
    }
  }
}

export const dashboardController = new DashboardController();
