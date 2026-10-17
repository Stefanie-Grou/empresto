import { Request, Response } from 'express';
import { emprestimoService } from '../services/EmprestimoService.js';

export class EmprestimoController {
  public async listar(req: Request, res: Response): Promise<void> {
    try {
      const busca = typeof req.query.busca === 'string'
        ? req.query.busca
        : typeof req.query.q === 'string'
        ? req.query.q
        : undefined;
      const status = typeof req.query.status === 'string' ? req.query.status : undefined;
      const resultado = await emprestimoService.listar(busca, status);
      res.status(200).json(resultado);
    } catch (error: any) {
      res.status(500).json({ erro: error.message || 'Erro ao consultar empréstimos.' });
    }
  }

  public async buscarPorId(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const resultado = await emprestimoService.buscarPorId(id);
      res.status(200).json(resultado);
    } catch (error: any) {
      const status = error.statusCode || 400;
      res.status(status).json({ erro: error.message || 'Erro ao buscar empréstimo.' });
    }
  }

  public async registrar(req: Request, res: Response): Promise<void> {
    try {
      const resultado = await emprestimoService.registrar(req.body);
      res.status(201).json(resultado);
    } catch (error: any) {
      const status = error.statusCode || 400;
      res.status(status).json({ erro: error.message || 'Erro ao registrar empréstimo.' });
    }
  }

  public async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const resultado = await emprestimoService.atualizar(id, req.body);
      res.status(200).json(resultado);
    } catch (error: any) {
      const status = error.statusCode || 400;
      res.status(status).json({ erro: error.message || 'Erro ao atualizar empréstimo.' });
    }
  }

  public async renovar(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const dias = req.body?.dias ? Number(req.body.dias) : 7;
      const resultado = await emprestimoService.renovar(id, dias);
      res.status(200).json(resultado);
    } catch (error: any) {
      const status = error.statusCode || 400;
      res.status(status).json({ erro: error.message || 'Erro ao renovar empréstimo.' });
    }
  }

  public async devolver(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const resultado = await emprestimoService.devolver(id);
      res.status(200).json(resultado);
    } catch (error: any) {
      const status = error.statusCode || 400;
      res.status(status).json({ erro: error.message || 'Erro ao registrar devolução.' });
    }
  }

  public async excluir(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const resultado = await emprestimoService.excluir(id);
      res.status(200).json(resultado);
    } catch (error: any) {
      const status = error.statusCode || 400;
      res.status(status).json({ erro: error.message || 'Erro ao excluir empréstimo.' });
    }
  }
}

export const emprestimoController = new EmprestimoController();
