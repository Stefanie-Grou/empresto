import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';

interface LoginDTO {
  login: string;
  senha: string;
}

interface CadastroDTO {
  nome: string;
  nomeUsuario: string;
  email: string;
  senha: string;
  perfil?: string;
}

interface AuthResponse {
  token: string;
  usuario: {
    id: number;
    nome: string;
    nomeUsuario: string;
    email: string;
    perfil: string;
  };
}

export class AuthService {
  private readonly jwtSecret: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'empresto_jwt_super_secret_key_2026';
  }

  public validatePasswordStrength(senha: string): void {
    if (!senha || senha.length < 6) {
      const error: any = new Error('A senha deve conter no mínimo 6 caracteres.');
      error.statusCode = 400;
      throw error;
    }

    const hasNumber = /\d/.test(senha);
    if (!hasNumber) {
      const error: any = new Error('A senha deve conter ao menos um número.');
      error.statusCode = 400;
      throw error;
    }

    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(senha);
    if (!hasSpecialChar) {
      const error: any = new Error('A senha deve conter ao menos um caractere especial (ex: @, #, $, !).');
      error.statusCode = 400;
      throw error;
    }
  }

  public async login({ login, senha }: LoginDTO): Promise<AuthResponse> {
    const client = await pool.connect();
    try {
      const termo = login.trim().toLowerCase();
      const res = await client.query(
        `
        SELECT 
          u.id_usuario, 
          u.email, 
          u.senha, 
          u.ativo, 
          COALESCE(u.nome, p.nome, 'Administrador') as nome, 
          COALESCE(u.nome_usuario, 'admin') as nome_usuario,
          COALESCE(u.perfil, p.tipo_pessoa, 'Admin') as perfil
        FROM usuario u
        LEFT JOIN pessoa p ON u.id_pessoa = p.id_pessoa
        WHERE LOWER(u.email) = $1 OR LOWER(u.nome_usuario) = $1
        LIMIT 1;
      `,
        [termo]
      );

      const usuario = res.rows[0];

      if (!usuario) {
        const error: any = new Error('E-mail ou nome de usuário não cadastrado.');
        error.statusCode = 401;
        throw error;
      }

      if (!usuario.ativo) {
        const error: any = new Error('Usuário inativo. Entre em contato com o suporte.');
        error.statusCode = 403;
        throw error;
      }

      const senhaCorreta = await bcryptjs.compare(senha, usuario.senha);
      if (!senhaCorreta) {
        const error: any = new Error('Senha incorreta. Verifique os dados informados.');
        error.statusCode = 401;
        throw error;
      }

      const perfilFinal = usuario.perfil === 'Admin' ? 'Admin' : 'Bibliotecário';

      const token = jwt.sign(
        {
          id: usuario.id_usuario,
          email: usuario.email,
          nome: usuario.nome,
          nomeUsuario: usuario.nome_usuario,
          perfil: perfilFinal,
        },
        this.jwtSecret,
        { expiresIn: '8h' }
      );

      return {
        token,
        usuario: {
          id: usuario.id_usuario,
          nome: usuario.nome,
          nomeUsuario: usuario.nome_usuario,
          email: usuario.email,
          perfil: perfilFinal,
        },
      };
    } finally {
      client.release();
    }
  }

  public async cadastrar({ nome, nomeUsuario, email, senha, perfil }: CadastroDTO): Promise<AuthResponse & { mensagem: string }> {
    const client = await pool.connect();
    try {
      const trimmedNome = nome?.trim();
      const trimmedUsername = nomeUsuario?.trim().toLowerCase();
      const trimmedEmail = email?.trim().toLowerCase();
      const userProfile = perfil === 'Admin' ? 'Admin' : 'Bibliotecário';

      if (!trimmedNome || !trimmedUsername || !trimmedEmail || !senha) {
        const error: any = new Error('Todos os campos são obrigatórios.');
        error.statusCode = 400;
        throw error;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        const error: any = new Error('Por favor, informe um endereço de e-mail válido.');
        error.statusCode = 400;
        throw error;
      }

      this.validatePasswordStrength(senha);

      const checkExisting = await client.query(
        `
        SELECT email, nome_usuario 
        FROM usuario 
        WHERE LOWER(email) = $1 OR LOWER(nome_usuario) = $2
        LIMIT 1;
      `,
        [trimmedEmail, trimmedUsername]
      );

      if (checkExisting.rows.length > 0) {
        const existing = checkExisting.rows[0];
        if (existing.email.toLowerCase() === trimmedEmail) {
          const error: any = new Error('Este e-mail já está cadastrado no sistema.');
          error.statusCode = 400;
          throw error;
        }
        if (existing.nome_usuario?.toLowerCase() === trimmedUsername) {
          const error: any = new Error('Este nome de usuário já está em uso.');
          error.statusCode = 400;
          throw error;
        }
      }

      const senhaHash = await bcryptjs.hash(senha, 10);

      const userRes = await client.query(
        `
        INSERT INTO usuario (nome, nome_usuario, email, senha, perfil, ativo)
        VALUES ($1, $2, $3, $4, $5, TRUE)
        RETURNING id_usuario, nome, nome_usuario, email, perfil;
      `,
        [trimmedNome, trimmedUsername, trimmedEmail, senhaHash, userProfile]
      );

      const novoUsuario = userRes.rows[0];

      const token = jwt.sign(
        {
          id: novoUsuario.id_usuario,
          email: novoUsuario.email,
          nome: novoUsuario.nome,
          nomeUsuario: novoUsuario.nome_usuario,
          perfil: novoUsuario.perfil,
        },
        this.jwtSecret,
        { expiresIn: '8h' }
      );

      return {
        mensagem: 'Usuário cadastrado com sucesso!',
        token,
        usuario: {
          id: novoUsuario.id_usuario,
          nome: novoUsuario.nome,
          nomeUsuario: novoUsuario.nome_usuario,
          email: novoUsuario.email,
          perfil: novoUsuario.perfil,
        },
      };
    } finally {
      client.release();
    }
  }
}

export const authService = new AuthService();
