import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import HeaderLogo from '../assets/HeaderLogo';
import Toast, { type ToastType } from '../components/Toast';

interface ToastState {
  id: number;
  type: ToastType;
  title: string;
  message: string;
}

interface ResetPasswordFormProps {
  onSwitchToLogin?: () => void;
  showHeaderLogo?: boolean;
  token?: string;
}

export function ResetPasswordForm({ onSwitchToLogin, showHeaderLogo = true, token: tokenProp }: ResetPasswordFormProps) {
  const [searchParams] = useSearchParams();
  const token = tokenProp || searchParams.get('token') || '';

  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const validateForm = (): boolean => {
    if (!token) {
      setToast({
        id: Date.now(),
        type: 'error',
        title: 'Token ausente',
        message: 'O link de recuperação é inválido ou não possui o token de segurança.',
      });
      return false;
    }

    if (!novaSenha.trim() || !confirmarSenha.trim()) {
      setToast({
        id: Date.now(),
        type: 'error',
        title: 'Campos obrigatórios',
        message: 'Por favor, preencha e confirme sua nova senha.',
      });
      return false;
    }

    if (novaSenha.length < 6) {
      setToast({
        id: Date.now(),
        type: 'error',
        title: 'Senha muito curta',
        message: 'A senha deve conter no mínimo 6 caracteres.',
      });
      return false;
    }

    if (!/\d/.test(novaSenha)) {
      setToast({
        id: Date.now(),
        type: 'error',
        title: 'Senha sem número',
        message: 'A senha deve conter ao menos um número.',
      });
      return false;
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(novaSenha)) {
      setToast({
        id: Date.now(),
        type: 'error',
        title: 'Senha sem caractere especial',
        message: 'A senha deve conter ao menos um caractere especial (ex: @, #, $, !).',
      });
      return false;
    }

    if (novaSenha !== confirmarSenha) {
      setToast({
        id: Date.now(),
        type: 'error',
        title: 'Senhas não coincidem',
        message: 'A confirmação de senha deve ser idêntica à nova senha digitada.',
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
      const response = await fetch('http://localhost:8080/api/v1/auth/redefinir-senha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          novaSenha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setToast({
          id: Date.now(),
          type: 'error',
          title: 'Erro na redefinição',
          message: data.erro || 'Não foi possível redefinir sua senha. Solicite um novo link.',
        });
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
      setToast({
        id: Date.now(),
        type: 'success',
        title: 'Senha redefinida',
        message: 'Sua senha foi redefinida com sucesso! Você já pode entrar.',
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

  const isFormEmpty = !novaSenha.trim() || !confirmarSenha.trim();

  return (
    <div className="w-full flex flex-col justify-center">
      {showHeaderLogo && <HeaderLogo />}

      <div className={`font-inter text-center ${showHeaderLogo ? 'mt-6' : 'mt-2'} mb-6`}>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Criar Nova Senha</h1>
        <p className="text-gray-500 text-xs sm:text-sm mt-1.5">
          {isSuccess
            ? 'Sua nova senha foi atualizada com sucesso.'
            : 'Defina uma nova senha forte para acessar sua conta.'}
        </p>
      </div>

      {isSuccess ? (
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl font-bold">
            ✓
          </div>
          <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
            Tudo pronto! Sua senha foi alterada com segurança. Agora você já pode fazer login na plataforma.
          </p>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="w-full py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 bg-main-background-green text-white hover:bg-[#0A2E22] cursor-pointer shadow-sm mt-4"
          >
            Ir para o Login
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="text-gray-700 flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="form-label" htmlFor="reset-nova-senha">
              Nova Senha
            </label>
            <input
              id="reset-nova-senha"
              name="novaSenha"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className="form-input"
              placeholder="Digite sua nova senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="form-label" htmlFor="reset-confirmar-senha">
              Confirmar Nova Senha
            </label>
            <input
              id="reset-confirmar-senha"
              name="confirmarSenha"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className="form-input"
              placeholder="Confirme sua nova senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
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
            {isLoading ? 'Salvando...' : 'Salvar Nova Senha'}
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

export default ResetPasswordForm;
