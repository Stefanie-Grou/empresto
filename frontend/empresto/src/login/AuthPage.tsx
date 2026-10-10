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
    <div className="min-h-screen w-full bg-gradient-to-b from-[#092B20] via-[#0D382A] to-[#124B38] lg:bg-white lg:p-4 xl:p-6 flex flex-col lg:flex-row items-stretch justify-between font-inter">
      <div className="w-full lg:w-1/2 min-h-auto lg:min-h-[calc(100vh-3rem)] flex flex-col">
        <Welcome />
      </div>

      <div className="w-full lg:w-1/2 min-h-auto lg:min-h-[calc(100vh-3rem)] bg-white rounded-t-[32px] sm:rounded-t-[36px] lg:rounded-none shadow-2xl lg:shadow-none flex items-center justify-center px-6 pt-8 pb-10 sm:px-10 lg:px-8 xl:px-12 mt-6 lg:mt-0">
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
