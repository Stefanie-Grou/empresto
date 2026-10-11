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
    <div className="min-h-screen w-full font-inter">
      <div className="lg:hidden min-h-screen w-full bg-gradient-to-b from-[#092B20] via-[#0D382A] to-[#124B38] flex flex-col justify-between">
        <div className="w-full pt-8 pb-4 px-4">
          <Welcome variant="mobile" />
        </div>

        <div className="w-full bg-white rounded-t-[32px] px-6 pt-8 pb-10 shadow-2xl mt-auto">
          <div
            className={`w-full max-w-[410px] mx-auto transition-all duration-200 ease-in-out ${
              isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
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
            className={`w-full max-w-[410px] transition-all duration-200 ease-in-out ${
              isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
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
