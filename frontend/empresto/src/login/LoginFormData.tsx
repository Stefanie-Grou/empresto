import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderLogo from '../assets/HeaderLogo';
import Toast, { type ToastType } from '../components/Toast';

interface LoginFormData {
  usuario: string;
  senha: string;
}

interface ToastState {
  id: number;
  type: ToastType;
  title: string;
  message: string;
}

export function LoginForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginFormData>({
    usuario: '',
    senha: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const handleChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    const email = formData.usuario.trim();
    const senha = formData.senha.trim();

    if (!email && !senha) {
      setToast({
        id: Date.now(),
        type: 'error',
        title: 'Campos obrigatórios',
        message: 'Por favor, preencha o e-mail e a senha para entrar.',
      });
      return false;
    }

    if (!email) {
      setToast({
        id: Date.now(),
        type: 'error',
        title: 'E-mail obrigatório',
        message: 'Por favor, informe seu endereço de e-mail.',
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

    if (!senha) {
      setToast({
        id: Date.now(),
        type: 'error',
        title: 'Senha obrigatória',
        message: 'Por favor, informe sua senha de acesso.',
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
      const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.usuario.trim(),
          senha: formData.senha.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setToast({
          id: Date.now(),
          type: 'error',
          title: 'Falha no login',
          message: data.erro || 'E-mail ou senha incorretos.',
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
        <h1 className="text-2xl font-semibold">Entre com sua conta</h1>
        <p className="text-medium-gray text-sm">
          Por favor, insira seus dados para entrar na sua conta.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="text-medium-gray flex flex-col gap-4 mt-6">
        <div className="flex flex-col">
          <label className="form-label">E-mail</label>
          <input
            type="email"
            className="form-input"
            placeholder="Digite seu e-mail"
            value={formData.usuario}
            onChange={(e) => handleChange('usuario', e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="form-label">Senha</label>
          <input
            type={showPassword ? 'text' : 'password'}
            className="form-input"
            placeholder="Digite sua senha"
            value={formData.senha}
            onChange={(e) => handleChange('senha', e.target.value)}
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
            <span>Mostrar senha</span>
          </label>

          <p className="text-main-background-green">
            <a href="#">Esqueceu a senha?</a>
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="buttons bg-main-background-green w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className="text-medium-gray text-sm text-center mt-6">
        Não tem conta?{' '}
        <a className="font-semibold text-main-background-green" href="#">
          Clique aqui
        </a>{' '}
        para cadastrar
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

export default LoginForm;