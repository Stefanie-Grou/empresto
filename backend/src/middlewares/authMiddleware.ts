import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: number;
  email: string;
  nome: string;
  perfil: string;
}

declare global {
  namespace Express {
    interface Request {
      usuario?: UserPayload;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ erro: 'Token de autenticação não fornecido.' });
    return;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    res.status(401).json({ erro: 'Formato de token inválido. Esperado Bearer <token>.' });
    return;
  }

  const token = parts[1];
  const secret = process.env.JWT_SECRET || 'empresto_jwt_super_secret_key_2026';

  try {
    const decoded = jwt.verify(token, secret) as UserPayload;
    req.usuario = decoded;
    next();
  } catch (error) {
    res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
}
