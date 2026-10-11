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

  public async esqueceuSenha(req: Request, res: Response): Promise<void> {
    try {
      const email = req.body.email || req.body.login || req.body.usuario;

      if (!email) {
        res.status(400).json({ erro: 'Por favor, informe seu e-mail ou nome de usuário.' });
        return;
      }

      const resultado = await authService.esqueceuSenha(email);
      res.status(200).json(resultado);
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({ erro: error.message || 'Erro ao processar recuperação de senha.' });
    }
  }

  public async redefinirSenha(req: Request, res: Response): Promise<void> {
    try {
      const { token, novaSenha, senha } = req.body;
      const finalSenha = novaSenha || senha;

      if (!token || !finalSenha) {
        res.status(400).json({ erro: 'Token e nova senha são obrigatórios.' });
        return;
      }

      const resultado = await authService.redefinirSenha(token, finalSenha);
      res.status(200).json(resultado);
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({ erro: error.message || 'Erro ao redefinir senha.' });
    }
  }
}

export const authController = new AuthController();
