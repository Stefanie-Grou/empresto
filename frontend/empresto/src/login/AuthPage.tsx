import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Welcome from './Welcome';
import LoginForm from './LoginFormData';
import RegisterForm from './RegisterFormData';
import ForgotPasswordForm from './ForgotPasswordForm';
import ResetPasswordForm from './ResetPasswordForm';

type AuthMode = 'login' | 'register' | 'forgot' | 'reset';

interface AuthPageProps {
  initialMode?: AuthMode;
}

export function AuthPage({ initialMode = 'login' }: AuthPageProps) {
  const location = useLocation();

  const getInitialMode = (): AuthMode => {
    if (location.pathname === '/cadastro') return 'register';
    if (location.pathname === '/esqueceu-senha') return 'forgot';
    if (location.pathname === '/redefinir-senha') return 'reset';
    return initialMode;
  };

  const [mode, setMode] = useState<AuthMode>(getInitialMode);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');
  const [prefilledUser, setPrefilledUser] = useState('');

  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname;
      if (pathname === '/cadastro') setMode('register');
      else if (pathname === '/esqueceu-senha') setMode('forgot');
      else if (pathname === '/redefinir-senha') setMode('reset');
      else setMode('login');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const switchMode = (newMode: AuthMode, prefill?: string) => {
    if (fadeState === 'out') return;

    if (prefill !== undefined) {
      setPrefilledUser(prefill);
    }

    setFadeState('out');

    setTimeout(() => {
      setMode(newMode);
      const path =
        newMode === 'register'
          ? '/cadastro'
          : newMode === 'forgot'
          ? '/esqueceu-senha'
          : newMode === 'reset'
          ? '/redefinir-senha'
          : '/';
      window.history.replaceState(null, '', path);

      requestAnimationFrame(() => {
        setTimeout(() => {
          setFadeState('in');
        }, 35);
      });
    }, 150);
  };

  const renderCurrentForm = (showHeaderLogo: boolean) => {
    switch (mode) {
      case 'register':
        return (
          <RegisterForm
            onSwitchToLogin={() => switchMode('login')}
            showHeaderLogo={showHeaderLogo}
          />
        );
      case 'forgot':
        return (
          <ForgotPasswordForm
            onSwitchToLogin={() => switchMode('login')}
            showHeaderLogo={showHeaderLogo}
            initialIdentificador={prefilledUser}
          />
        );
      case 'reset':
        return (
          <ResetPasswordForm
            onSwitchToLogin={() => switchMode('login')}
            showHeaderLogo={showHeaderLogo}
          />
        );
      case 'login':
      default:
        return (
          <LoginForm
            onSwitchToRegister={() => switchMode('register')}
            onForgotPassword={(typedUser) => switchMode('forgot', typedUser || '')}
            showHeaderLogo={showHeaderLogo}
          />
        );
    }
  };

  return (
    <div className="min-h-screen w-full font-inter">
      <div className="lg:hidden min-h-screen w-full bg-linear-to-b from-70% from-main-background-green to-background-lighter-green flex flex-col justify-between">
        <div className="w-full pt-8 pb-4 px-4">
          <Welcome variant="mobile" />
        </div>

        <div className="w-full bg-white rounded-t-[32px] px-6 pt-8 pb-10 shadow-2xl mt-auto">
          <div
            className={`w-full max-w-[410px] mx-auto transition-all duration-200 ease-out ${
              fadeState === 'out'
                ? 'opacity-0 translate-y-1.5'
                : 'opacity-100 translate-y-0'
            }`}
          >
            {renderCurrentForm(false)}
          </div>
        </div>
      </div>

      <div className="hidden lg:flex min-h-screen w-full bg-white p-3 sm:p-4 lg:p-5 xl:p-6 flex-row items-stretch">
        <div className="w-1/2 min-h-[calc(100vh-2.5rem)]">
          <Welcome variant="desktop" />
        </div>

        <div className="w-1/2 min-h-[calc(100vh-2.5rem)] flex items-center justify-center p-6 lg:p-12">
          <div
            className={`w-full max-w-[410px] transition-all duration-200 ease-out ${
              fadeState === 'out'
                ? 'opacity-0 translate-y-1.5'
                : 'opacity-100 translate-y-0'
            }`}
          >
            {renderCurrentForm(true)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
