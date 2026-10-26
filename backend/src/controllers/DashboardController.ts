import { Request, Response } from 'express';
import { dashboardService } from '../services/DashboardService.js';

export class DashboardController {
  public async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await dashboardService.getStats();
      res.status(200).json(stats);
    } catch (error: any) {
      res.status(500).json({ erro: error.message || 'Erro ao buscar estatísticas do dashboard.' });
    }
  }
}

export const dashboardController = new DashboardController();
