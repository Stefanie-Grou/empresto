import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import HeaderLogo from '../assets/HeaderLogo';

interface FieldErrors {
  email?: string;
  senha?: string;
}

interface NotificationState {
  type: 'error' | 'success';
  message: string;
}

export function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrarMe, setLembrarMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};
    const trimmedEmail = email.trim();
    const trimmedSenha = senha.trim();

    if (!trimmedEmail) {
      errors.email = 'O campo de e-mail é obrigatório.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        errors.email = 'Insira um endereço de e-mail válido.';
      }
    }

    if (!trimmedSenha) {
      errors.senha = 'O campo de senha é obrigatório.';
    }

    setFieldErrors(errors);

    if (errors.email && errors.senha) {
      setNotification({
        type: 'error',
        message: 'Por favor, preencha seu e-mail e sua senha para continuar.',
      });
      return false;
    }

    if (errors.email) {
      setNotification({
        type: 'error',
        message: errors.email,
      });
      return false;
    }

    if (errors.senha) {
      setNotification({
        type: 'error',
        message: errors.senha,
      });
      return false;
    }

    setNotification(null);
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setNotification(null);

    await new Promise((resolve) => setTimeout(resolve, 800));

    localStorage.setItem(
      'empresto_auth',
      JSON.stringify({
        email: email.trim(),
        autenticado: true,
        lembrarMe,
        dataLogin: new Date().toISOString(),
      })
    );

    setNotification({
      type: 'success',
      message: 'Login realizado com sucesso! Redirecionando...',
    });

    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 700);
  };

  return (
    <div className="bg-white-background min-h-screen flex items-center justify-center p-6 sm:p-10 lg:p-14">
      <div className="w-full max-w-md">
        <HeaderLogo />

        <div className="text-center">
          <h1 className="font-jakarta text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Entre com sua conta
          </h1>
          <p className="font-inter text-medium-gray text-sm mt-1.5">
            Por favor, insira seus dados para entrar na sua conta.
          </p>
        </div>

        {notification && (
          <div
            className={`mt-6 p-4 rounded-xl text-sm flex items-start gap-3 transition-all duration-200 border ${
              notification.type === 'error'
                ? 'bg-red-50/90 border-red-200 text-red-800'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
            role="alert"
          >
            <Icon
              icon={
                notification.type === 'error'
                  ? 'lucide:alert-circle'
                  : 'lucide:check-circle-2'
              }
              className={`w-5 h-5 shrink-0 mt-0.5 ${
                notification.type === 'error' ? 'text-red-600' : 'text-emerald-600'
              }`}
            />
            <span className="font-medium leading-relaxed">{notification.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
          <div>
            <label className="form-label" htmlFor="email-input">
              E-mail
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Icon icon="lucide:mail" className="w-5 h-5" />
              </span>
              <input
                id="email-input"
                type="email"
                value={email}
                disabled={isLoading}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) {
                    setFieldErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                className={`form-input pl-11 ${
                  fieldErrors.email
                    ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
                    : ''
                }`}
                placeholder="exemplo@escola.sp.gov.br"
              />
            </div>
            {fieldErrors.email && (
              <p className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1">
                <Icon icon="lucide:alert-circle" className="w-3.5 h-3.5 shrink-0" />
                <span>{fieldErrors.email}</span>
              </p>
            )}
          </div>

          <div>
            <label className="form-label" htmlFor="senha-input">
              Senha
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Icon icon="lucide:lock" className="w-5 h-5" />
              </span>
              <input
                id="senha-input"
                type={showPassword ? 'text' : 'password'}
                value={senha}
                disabled={isLoading}
                onChange={(e) => {
                  setSenha(e.target.value);
                  if (fieldErrors.senha) {
                    setFieldErrors((prev) => ({ ...prev, senha: undefined }));
                  }
                }}
                className={`form-input pl-11 pr-11 ${
                  fieldErrors.senha
                    ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
                    : ''
                }`}
                placeholder="Digite sua senha"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                <Icon
                  icon={showPassword ? 'lucide:eye-off' : 'lucide:eye'}
                  className="w-5 h-5"
                />
              </button>
            </div>
            {fieldErrors.senha && (
              <p className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1">
                <Icon icon="lucide:alert-circle" className="w-3.5 h-3.5 shrink-0" />
                <span>{fieldErrors.senha}</span>
              </p>
            )}
          </div>

          <div className="flex items-center justify-between font-jakarta text-sm text-medium-gray mt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={lembrarMe}
                onChange={(e) => setLembrarMe(e.target.checked)}
                className="w-4 h-4 rounded text-main-background-green focus:ring-main-background-green/20 border-gray-300 cursor-pointer"
              />
              <span className="text-gray-600 text-xs sm:text-sm">Lembrar-me</span>
            </label>

            <a
              href="#"
              className="text-xs sm:text-sm font-medium text-main-background-green hover:underline"
            >
              Esqueceu a senha?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="buttons w-full flex items-center justify-center gap-2 mt-4 text-base font-semibold shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Icon icon="lucide:loader-2" className="w-5 h-5 animate-spin" />
                <span>Entrando...</span>
              </>
            ) : (
              <>
                <span>Entrar</span>
                <Icon icon="lucide:arrow-right" className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <p className="text-medium-gray text-xs sm:text-sm text-center mt-8 font-inter">
          Não tem uma conta?{' '}
          <a
            href="#"
            className="font-semibold text-main-background-green hover:underline"
          >
            Clique aqui para cadastrar
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;