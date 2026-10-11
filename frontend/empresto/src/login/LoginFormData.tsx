import { useState, useEffect, type FormEvent } from 'react';
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

interface LoginFormProps {
  onSwitchToRegister?: () => void;
  onForgotPassword?: (usuarioAtual?: string) => void;
  showHeaderLogo?: boolean;
}

export function LoginForm({ onSwitchToRegister, onForgotPassword, showHeaderLogo = true }: LoginFormProps) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginFormData>({
    usuario: '',
    senha: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('empresto_saved_user');
    if (savedUser) {
      if (savedUser === 'admin@empresto.com') {
        localStorage.removeItem('empresto_saved_user');
      } else {
        setFormData((prev) => ({ ...prev, usuario: savedUser }));
      }
    }
  }, []);

  const handleChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    const usuario = formData.usuario.trim();
    const senha = formData.senha.trim();

    if (!usuario && !senha) {
      setToast({
        id: Date.now(),
        type: 'error',
        title: 'Campos obrigatórios',
        message: 'Por favor, preencha o usuário e a senha para entrar.',
      });
      return false;
    }

    if (!usuario) {
      setToast({
        id: Date.now(),
        type: 'error',
        title: 'Usuário obrigatório',
        message: 'Por favor, informe seu usuário ou e-mail de acesso.',
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
          login: formData.usuario.trim(),
          email: formData.usuario.trim(),
          usuario: formData.usuario.trim(),
          senha: formData.senha.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setToast({
          id: Date.now(),
          type: 'error',
          title: 'Falha no login',
          message: data.erro || 'Usuário ou senha incorretos.',
        });
        setIsLoading(false);
        return;
      }

      localStorage.setItem('empresto_saved_user', formData.usuario.trim());
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

  const isFormEmpty = !formData.usuario.trim() || !formData.senha.trim();

  return (
    <div className="w-full flex flex-col justify-center">
      {showHeaderLogo && <HeaderLogo />}

      <div className={`font-inter text-center ${showHeaderLogo ? 'mt-6' : 'mt-2'} mb-6`}>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Entre com sua Conta</h1>
        <p className="text-gray-500 text-xs sm:text-sm mt-1.5">
          Por favor, insira seus dados para entrar na sua conta.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="text-gray-700 flex flex-col gap-4">
        <div className="flex flex-col">
          <label className="form-label" htmlFor="login-usuario">
            Usuário
          </label>
          <input
            id="login-usuario"
            name="username"
            type="text"
            autoComplete="username"
            className="form-input"
            placeholder="Digite seu usuário"
            value={formData.usuario}
            onChange={(e) => handleChange('usuario', e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="form-label" htmlFor="login-senha">
            Senha
          </label>
          <input
            id="login-senha"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            className="form-input"
            placeholder="Digite sua senha"
            value={formData.senha}
            onChange={(e) => handleChange('senha', e.target.value)}
          />
        </div>

        <div className="w-full flex items-center justify-between text-xs sm:text-sm pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none text-gray-600">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="w-4 h-4 rounded-full border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <span>Mostrar senha</span>
          </label>

          <button
            type="button"
            onClick={() => onForgotPassword?.(formData.usuario.trim())}
            className="text-emerald-500 hover:text-emerald-600 font-medium bg-transparent border-0 p-0 cursor-pointer"
          >
            Esqueceu a senha?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading || isFormEmpty}
          className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center mt-2 ${
            isFormEmpty
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-main-background-green text-white hover:bg-[#0A2E22] cursor-pointer shadow-sm'
          }`}
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className="text-gray-500 text-xs sm:text-sm text-center mt-6">
        Não tem conta?{' '}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="font-medium text-gray-700 underline hover:text-black cursor-pointer bg-transparent border-0 p-0"
        >
          Clique aqui
        </button>{' '}
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