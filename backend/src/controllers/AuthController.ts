import { Request, Response } from 'express';
import { authService } from '../services/AuthService.js';

export class AuthController {
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const login = req.body.login || req.body.email || req.body.usuario;
      const senha = req.body.senha;

      if (!login || !senha) {
        res.status(400).json({ erro: 'Identificação (e-mail ou usuário) e senha são obrigatórios.' });
        return;
      }

      const resultado = await authService.login({ login, senha });
      res.status(200).json(resultado);
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({ erro: error.message || 'Erro interno na autenticação.' });
    }
  }

  public async cadastrar(req: Request, res: Response): Promise<void> {
    try {
      const { nome, nomeUsuario, email, senha } = req.body;

      const resultado = await authService.cadastrar({
        nome,
        nomeUsuario: nomeUsuario || req.body.usuario,
        email,
        senha,
      });

      res.status(201).json(resultado);
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({ erro: error.message || 'Erro ao realizar cadastro.' });
    }
  }
}

export const authController = new AuthController();
