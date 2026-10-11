import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';
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
      const cleanLogin = login.trim().toLowerCase();

      const res = await client.query(
        `
        SELECT id_usuario, nome, nome_usuario, email, senha, perfil, ativo 
        FROM usuario 
        WHERE LOWER(email) = $1 OR LOWER(nome_usuario) = $1
        LIMIT 1;
      `,
        [cleanLogin]
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

  public async esqueceuSenha(identificador: string): Promise<{ mensagem: string; emailEnviado?: string; linkSimulado?: string }> {
    const client = await pool.connect();
    try {
      const cleanIdentificador = identificador.trim().toLowerCase();

      const res = await client.query(
        `
        SELECT id_usuario, nome, nome_usuario, email, ativo
        FROM usuario
        WHERE LOWER(email) = $1 OR LOWER(nome_usuario) = $1
        LIMIT 1;
      `,
        [cleanIdentificador]
      );

      const usuario = res.rows[0];

      if (!usuario) {
        const error: any = new Error('E-mail ou nome de usuário não encontrado.');
        error.statusCode = 404;
        throw error;
      }

      if (!usuario.ativo) {
        const error: any = new Error('Usuário inativo. Entre em contato com o suporte.');
        error.statusCode = 403;
        throw error;
      }

      const token = jwt.sign(
        {
          id: usuario.id_usuario,
          email: usuario.email,
          type: 'reset_password',
        },
        this.jwtSecret,
        { expiresIn: '1h' }
      );

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const resetLink = `${frontendUrl}/redefinir-senha?token=${token}`;
      const emailHtml = this.gerarEmailRecuperacaoSenha(usuario.nome, resetLink);

      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;
      const resendApiKey = process.env.RESEND_API_KEY;
      let emailDisparado = false;

      if (smtpUser && smtpPass) {
        try {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
          });

          await transporter.sendMail({
            from: `"Emprestô" <${smtpUser}>`,
            to: usuario.email,
            subject: 'Recuperação de Senha - Emprestô',
            html: emailHtml,
          });

          emailDisparado = true;
        } catch (smtpError: any) {
          console.error('Falha no envio via Gmail SMTP:', smtpError.message);
        }
      }

      if (!emailDisparado && resendApiKey && resendApiKey.trim() !== '') {
        try {
          const resend = new Resend(resendApiKey.trim());
          const fromEmail = process.env.RESEND_FROM_EMAIL || 'Emprestô <onboarding@resend.dev>';

          const envio = await resend.emails.send({
            from: fromEmail,
            to: [usuario.email],
            subject: 'Recuperação de Senha - Emprestô',
            html: emailHtml,
          });

          if (!envio.error) {
            emailDisparado = true;
          } else {
            console.error('Falha no envio via Resend:', envio.error.message);
          }
        } catch (resendError: any) {
          console.error('Falha no envio via Resend:', resendError.message);
        }
      }

      return {
        mensagem: 'Instruções para redefinição de senha enviadas com sucesso!',
        emailEnviado: usuario.email,
        linkSimulado: !emailDisparado ? resetLink : undefined,
      };
    } finally {
      client.release();
    }
  }

  public async redefinirSenha(token: string, novaSenha: string): Promise<{ mensagem: string }> {
    const client = await pool.connect();
    try {
      let payload: any;
      try {
        payload = jwt.verify(token, this.jwtSecret);
      } catch {
        const error: any = new Error('Link de recuperação inválido ou expirado. Solicite um novo link.');
        error.statusCode = 400;
        throw error;
      }

      if (payload.type !== 'reset_password') {
        const error: any = new Error('Tipo de token inválido para redefinição de senha.');
        error.statusCode = 400;
        throw error;
      }

      this.validatePasswordStrength(novaSenha);

      const senhaHash = await bcryptjs.hash(novaSenha, 10);

      await client.query(
        `
        UPDATE usuario
        SET senha = $1
        WHERE id_usuario = $2;
      `,
        [senhaHash, payload.id]
      );

      return {
        mensagem: 'Senha redefinida com sucesso! Você já pode fazer login com sua nova senha.',
      };
    } finally {
      client.release();
    }
  }

  private gerarEmailRecuperacaoSenha(nome: string, link: string): string {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recuperação de Senha - Emprestô</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F4F6F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1F2937;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F4F6F5; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 560px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #E5E7EB;">
          <tr>
            <td style="background: linear-gradient(180deg, #0E3D2D 0%, #1A594C 100%); padding: 36px 32px; text-align: center;">
              <div style="display: inline-block; width: 48px; height: 48px; border-radius: 12px; background-color: rgba(1, 223, 130, 0.15); margin-bottom: 12px; line-height: 48px; text-align: center;">
                <span style="font-size: 26px;">📖</span>
              </div>
              <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: 0.5px;">
                Emprestô
              </h1>
              <p style="margin: 6px 0 0; font-size: 13px; color: #87B1A6;">
                Organização e Gestão da Sala de Leitura
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 32px 28px;">
              <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 700; color: #0E3D2D;">
                Recuperação de Senha
              </h2>
              <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #4B5563;">
                Olá, <strong>${nome}</strong>!
              </p>
              <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #4B5563;">
                Recebemos uma solicitação para redefinir a senha da sua conta no <strong>Emprestô</strong>. Clique no botão seguro abaixo para escolher uma nova senha de acesso:
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 32px 0; width: 100%;">
                <tr>
                  <td align="center">
                    <a href="${link}" target="_blank" style="background-color: #0E3D2D; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 15px; font-weight: 600; display: inline-block; box-shadow: 0 2px 8px rgba(14, 61, 45, 0.25);">
                      Redefinir Minha Senha
                    </a>
                  </td>
                </tr>
              </table>
              <div style="background-color: #F9FAFB; border-left: 4px solid #01DF82; border-radius: 8px; padding: 14px 16px; margin: 24px 0;">
                <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #6B7280;">
                  ⏱️ <strong>Segurança:</strong> Este link é válido por <strong>1 hora</strong>. Após esse período, será necessário solicitar um novo link.
                </p>
              </div>
              <p style="margin: 24px 0 0; font-size: 13px; line-height: 1.6; color: #9CA3AF;">
                Se você não solicitou a redefinição de senha, fique tranquilo: sua conta permanece segura e nenhuma alteração foi realizada.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px; background-color: #FAFAFA; border-top: 1px solid #E5E7EB; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #9CA3AF;">
                Emprestô &copy; 2026 &bull; Sistema de Gestão de Acervo e Empréstimos
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }
}

export const authService = new AuthService();
