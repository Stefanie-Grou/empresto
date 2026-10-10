import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Welcome from './Welcome';
import LoginForm from './LoginFormData';
import RegisterForm from './RegisterFormData';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
}

export function AuthPage({ initialMode = 'login' }: AuthPageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>(
    location.pathname === '/cadastro' ? 'register' : initialMode
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (location.pathname === '/cadastro' && mode !== 'register') {
      setMode('register');
    } else if (location.pathname === '/' && mode !== 'login') {
      setMode('login');
    }
  }, [location.pathname, mode]);

  const switchMode = (newMode: 'login' | 'register') => {
    setIsTransitioning(true);
    setTimeout(() => {
      setMode(newMode);
      setIsTransitioning(false);
      navigate(newMode === 'register' ? '/cadastro' : '/', { replace: true });
    }, 180);
  };

  return (
    <div className="min-h-screen w-full bg-white p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col lg:flex-row items-stretch font-inter">
      <div className="hidden lg:flex lg:w-1/2 min-h-[calc(100vh-3rem)]">
        <Welcome />
      </div>

      <div className="w-full lg:w-1/2 min-h-[calc(100vh-3rem)] flex items-center justify-center px-4 py-8 sm:px-8 md:px-12">
        <div
          className={`w-full max-w-[410px] transition-all duration-200 ease-in-out ${
            isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          {mode === 'login' ? (
            <LoginForm onSwitchToRegister={() => switchMode('register')} />
          ) : (
            <RegisterForm onSwitchToLogin={() => switchMode('login')} />
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
