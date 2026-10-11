import { useState, useEffect, type FormEvent } from 'react';
import HeaderLogo from '../assets/HeaderLogo';
import Toast, { type ToastType } from '../components/Toast';

interface ToastState {
  id: number;
  type: ToastType;
  title: string;
  message: string;
}

interface ForgotPasswordFormProps {
  onSwitchToLogin?: () => void;
  showHeaderLogo?: boolean;
  initialIdentificador?: string;
}

export function ForgotPasswordForm({
  onSwitchToLogin,
  showHeaderLogo = true,
  initialIdentificador = '',
}: ForgotPasswordFormProps) {
  const [identificador, setIdentificador] = useState(initialIdentificador);
  const [isLoading, setIsLoading] = useState(false);
  const [emailEnviado, setEmailEnviado] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    if (initialIdentificador) {
      setIdentificador(initialIdentificador);
    }
  }, [initialIdentificador]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanInput = identificador.trim();
    if (!cleanInput) {
      setToast({
        id: Date.now(),
        type: 'error',
        title: 'Campo obrigatório',
        message: 'Por favor, informe seu usuário ou e-mail para continuar.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/esqueceu-senha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: cleanInput }),
      });

      const data = await response.json();

      if (!response.ok) {
        setToast({
          id: Date.now(),
          type: 'error',
          title: 'Erro na solicitação',
          message: data.erro || 'Não foi possível processar a recuperação de senha.',
        });
        setIsLoading(false);
        return;
      }

      setEmailEnviado(true);
      setToast({
        id: Date.now(),
        type: 'success',
        title: 'E-mail enviado',
        message: 'Instruções enviadas para seu e-mail cadastrado.',
      });
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

  const isFormEmpty = !identificador.trim();

  return (
    <div className="w-full flex flex-col justify-center">
      {showHeaderLogo && <HeaderLogo />}

      <div className={`font-inter text-center ${showHeaderLogo ? 'mt-6' : 'mt-2'} mb-6`}>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Recuperar Senha</h1>
        <p className="text-gray-500 text-xs sm:text-sm mt-1.5">
          {emailEnviado
            ? 'Verifique sua caixa de entrada para redefinir a senha.'
            : 'Por favor, insira seus dados para receber o link de recuperação.'}
        </p>
      </div>

      {emailEnviado ? (
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl font-bold">
            ✓
          </div>
          <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
            Enviamos um e-mail com as instruções para redefinição da sua senha. Verifique também sua pasta de spam ou lixo eletrônico.
          </p>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="w-full py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 bg-main-background-green text-white hover:bg-[#0A2E22] cursor-pointer shadow-sm mt-4"
          >
            Voltar para o Login
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate autoComplete="off" className="text-gray-700 flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="form-label" htmlFor="forgot-usuario">
              Usuário ou E-mail
            </label>
            <input
              id="forgot-usuario"
              name="recovery_account_id"
              type="text"
              autoComplete="off"
              data-1p-ignore="true"
              data-lpignore="true"
              spellCheck={false}
              className="form-input"
              placeholder="Digite seu usuário ou e-mail cadastrado"
              value={identificador}
              onChange={(e) => setIdentificador(e.target.value)}
            />
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
            {isLoading ? 'Enviando...' : 'Enviar Instruções'}
          </button>
        </form>
      )}

      <p className="text-gray-500 text-xs sm:text-sm text-center mt-6">
        Lembrou da senha?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-medium text-gray-700 underline hover:text-black cursor-pointer bg-transparent border-0 p-0"
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

export default ForgotPasswordForm;
