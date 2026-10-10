import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderLogo from '../assets/HeaderLogo';
import Toast, { type ToastType } from '../components/Toast';

interface RegisterFormData {
  nomeUsuario: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}

interface ToastState {
  id: number;
  type: ToastType;
  title: string;
  message: string;
}

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterFormData>({
    nomeUsuario: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const handleChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    const nomeUsuario = formData.nomeUsuario.trim();
    const email = formData.email.trim();
    const senha = formData.senha;
    const confirmarSenha = formData.confirmarSenha;

    if (!nomeUsuario || !email || !senha || !confirmarSenha) {
      setToast({
        id: Date.now(),
        type: 'error',
        title: 'Campos obrigatórios',
        message: 'Por favor, preencha todos os campos para realizar o cadastro.',
      });
      return false;
    }

    if (nomeUsuario.length < 3) {
      setToast({
        id: Date.now(),
        type: 'warning',
        title: 'Nome de usuário curto',
        message: 'O nome de usuário deve conter no mínimo 3 caracteres.',
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setToast({
        id: Date.now(),
        type: 'warning',
        title: 'E-mail incompleto',
        message: 'O e-mail deve conter o formato completo (exemplo: usuario@dominio.com).',
      });
      return false;
    }

    if (senha.length < 6) {
      setToast({
        id: Date.now(),
        type: 'error',
        title: 'Senha muito curta',
        message: 'A senha deve conter no mínimo 6 caracteres.',
      });
      return false;
    }

    if (!/\d/.test(senha)) {
      setToast({
        id: Date.now(),
        type: 'error',
        title: 'Senha sem número',
        message: 'A senha deve conter ao menos um número.',
      });
      return false;
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(senha)) {
      setToast({
        id: Date.now(),
        type: 'error',
        title: 'Senha sem caractere especial',
        message: 'A senha deve conter ao menos um caractere especial (ex: @, #, $, !).',
      });
      return false;
    }

    if (senha !== confirmarSenha) {
      setToast({
        id: Date.now(),
        type: 'error',
        title: 'Senhas não coincidem',
        message: 'A confirmação de senha deve ser idêntica à senha digitada.',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.nomeUsuario.trim(),
          nomeUsuario: formData.nomeUsuario.trim(),
          email: formData.email.trim(),
          senha: formData.senha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setToast({
          id: Date.now(),
          type: 'error',
          title: 'Erro no cadastro',
          message: data.erro || 'Não foi possível concluir o cadastro.',
        });
        setIsLoading(false);
        return;
      }

      localStorage.setItem('empresto_token', data.token);
      localStorage.setItem('empresto_usuario', JSON.stringify(data.usuario));
      sessionStorage.setItem('login_success', 'true');

      navigate('/dashboard', { state: { loginSuccess: true } });
    } catch {
      setToast({
        id: Date.now(),
        type: 'error',
        title: 'Erro de conexão',
        message: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white-background p-10 flex flex-col justify-center">
      <HeaderLogo />

      <div className="font-inter text-center mt-4">
        <h1 className="text-2xl font-semibold">Crie sua conta</h1>
        <p className="text-medium-gray text-sm">
          Preencha seus dados para começar a usar o Emprestô.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="text-medium-gray flex flex-col gap-4 mt-6">
        <div className="flex flex-col">
          <label className="form-label" htmlFor="register-username">
            Nome de Usuário
          </label>
          <input
            id="register-username"
            name="username"
            type="text"
            autoComplete="username"
            className="form-input"
            placeholder="Digite seu nome de usuário"
            value={formData.nomeUsuario}
            onChange={(e) => handleChange('nomeUsuario', e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="form-label" htmlFor="register-email">
            E-mail
          </label>
          <input
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            className="form-input"
            placeholder="Digite seu e-mail"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="form-label" htmlFor="register-password">
            Senha
          </label>
          <input
            id="register-password"
            name="new-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            className="form-input"
            placeholder="Mínimo 6 caracteres, número e caractere especial"
            value={formData.senha}
            onChange={(e) => handleChange('senha', e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="form-label" htmlFor="register-confirm-password">
            Confirmar Senha
          </label>
          <input
            id="register-confirm-password"
            name="confirm-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            className="form-input"
            placeholder="Repita a senha informada"
            value={formData.confirmarSenha}
            onChange={(e) => handleChange('confirmarSenha', e.target.value)}
          />
        </div>

        <div className="login-options">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="rounded"
            />
            <span>Mostrar senhas</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="buttons bg-main-background-green w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
        >
          {isLoading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>

      <p className="text-medium-gray text-sm text-center mt-6">
        Já tem uma conta?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-semibold text-main-background-green hover:underline cursor-pointer bg-transparent border-0 p-0"
        >
          Clique aqui
        </button>{' '}
        para entrar
      </p>

      {toast && (
        <Toast
          key={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default RegisterForm;
