import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Welcome from './Welcome';
import LoginForm from './LoginFormData';
import RegisterForm from './RegisterFormData';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
}

export function AuthPage({ initialMode = 'login' }: AuthPageProps) {
  const location = useLocation();
  const [mode, setMode] = useState<'login' | 'register'>(
    location.pathname === '/cadastro' ? 'register' : initialMode
  );
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');

  useEffect(() => {
    const handlePopState = () => {
      const isCadastro = window.location.pathname === '/cadastro';
      setMode(isCadastro ? 'register' : 'login');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const switchMode = (newMode: 'login' | 'register') => {
    if (fadeState === 'out') return;

    setFadeState('out');

    setTimeout(() => {
      setMode(newMode);
      window.history.replaceState(null, '', newMode === 'register' ? '/cadastro' : '/');

      requestAnimationFrame(() => {
        setTimeout(() => {
          setFadeState('in');
        }, 35);
      });
    }, 150);
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
            {mode === 'login' ? (
              <LoginForm
                onSwitchToRegister={() => switchMode('register')}
                showHeaderLogo={false}
              />
            ) : (
              <RegisterForm
                onSwitchToLogin={() => switchMode('login')}
                showHeaderLogo={false}
              />
            )}
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
            {mode === 'login' ? (
              <LoginForm
                onSwitchToRegister={() => switchMode('register')}
                showHeaderLogo={true}
              />
            ) : (
              <RegisterForm
                onSwitchToLogin={() => switchMode('login')}
                showHeaderLogo={true}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
