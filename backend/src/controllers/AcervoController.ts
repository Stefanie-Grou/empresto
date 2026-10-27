import { Request, Response } from 'express';
import { acervoService } from '../services/AcervoService.js';

export class AcervoController {
  public async listar(req: Request, res: Response): Promise<void> {
    try {
      const busca = typeof req.query.busca === 'string'
        ? req.query.busca
        : typeof req.query.titulo === 'string'
        ? req.query.titulo
        : typeof req.query.q === 'string'
        ? req.query.q
        : undefined;
      const acervo = await acervoService.listar(busca);
      res.status(200).json(acervo);
    } catch (error: any) {
      res.status(500).json({ erro: error.message || 'Erro interno ao consultar acervo.' });
    }
  }

  public async listarPessoas(req: Request, res: Response): Promise<void> {
    try {
      const pessoas = await acervoService.listarPessoas();
      res.status(200).json(pessoas);
    } catch (error: any) {
      res.status(500).json({ erro: error.message || 'Erro ao consultar pessoas.' });
    }
  }

  public async cadastrar(req: Request, res: Response): Promise<void> {
    try {
      const resultado = await acervoService.cadastrar(req.body);
      res.status(201).json(resultado);
    } catch (error: any) {
      const status = error.statusCode || 400;
      res.status(status).json({ erro: error.message || 'Erro ao cadastrar item no acervo.' });
    }
  }

  public async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const resultado = await acervoService.atualizar(id, req.body);
      res.status(200).json(resultado);
    } catch (error: any) {
      const status = error.statusCode || 400;
      res.status(status).json({ erro: error.message || 'Erro ao atualizar item no acervo.' });
    }
  }

  public async excluir(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const resultado = await acervoService.excluir(id);
      res.status(200).json(resultado);
    } catch (error: any) {
      const status = error.statusCode || 400;
      res.status(status).json({ erro: error.message || 'Erro ao excluir item do acervo.' });
    }
  }

  public async adicionarFila(req: Request, res: Response): Promise<void> {
    try {
      const acervoId = Number(req.params.acervoId);
      const { nomeAluno, nomePessoa, tipoPessoa, personType, serie, turma } = req.body || {};

      if (isNaN(acervoId)) {
        res.status(400).json({ erro: 'ID do acervo inválido.' });
        return;
      }

      const resultado = await acervoService.adicionarFila(acervoId, {
        nomeAluno,
        nomePessoa,
        tipoPessoa,
        personType,
        serie,
        turma,
      });
      res.status(201).json(resultado);
    } catch (error: any) {
      const status = error.statusCode || 400;
      res.status(status).json({ erro: error.message });
    }
  }

  public async listarFila(_req: Request, res: Response): Promise<void> {
    try {
      const resultado = await acervoService.listarFila();
      res.status(200).json(resultado);
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({ erro: error.message || 'Erro ao consultar a fila de espera.' });
    }
  }

  public async removerFila(req: Request, res: Response): Promise<void> {
    try {
      const acervoId = Number(req.params.acervoId);
      const { nomeAluno, nomePessoa, tipoPessoa, personType, serie, turma } = req.body || {};

      const resultado = await acervoService.removerFila(acervoId, {
        nomeAluno,
        nomePessoa,
        tipoPessoa,
        personType,
        serie,
        turma,
      });
      res.status(200).json(resultado);
    } catch (error: any) {
      const status = error.statusCode || 400;
      res.status(status).json({ erro: error.message });
    }
  }

  public async atualizarFila(req: Request, res: Response): Promise<void> {
    try {
      const acervoId = Number(req.params.acervoId);
      const { nomeAluno, nomePessoa, tipoPessoa, personType, serie, turma } = req.body || {};

      const resultado = await acervoService.atualizarFila(acervoId, {
        nomeAluno,
        nomePessoa,
        tipoPessoa,
        personType,
        serie,
        turma,
      });
      res.status(200).json(resultado);
    } catch (error: any) {
      const status = error.statusCode || 400;
      res.status(status).json({ erro: error.message });
    }
  }
}

export const acervoController = new AcervoController();
