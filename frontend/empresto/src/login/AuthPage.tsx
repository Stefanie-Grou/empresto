import { useState } from 'react';
import Welcome from './Welcome';
import LoginForm from './LoginFormData';
import RegisterForm from './RegisterFormData';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
}

export function AuthPage({ initialMode = 'login' }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const switchMode = (newMode: 'login' | 'register') => {
    setIsTransitioning(true);
    setTimeout(() => {
      setMode(newMode);
      setIsTransitioning(false);
    }, 200);
  };

  return (
    <div className="App grid grid-cols-2 w-full min-h-screen font-inter">
      <Welcome />
      <div
        className={`w-full transition-all duration-300 ease-in-out ${
          isTransitioning ? 'opacity-0 scale-98' : 'opacity-100 scale-100'
        }`}
      >
        {mode === 'login' ? (
          <LoginForm onSwitchToRegister={() => switchMode('register')} />
        ) : (
          <RegisterForm onSwitchToLogin={() => switchMode('login')} />
        )}
      </div>
    </div>
  );
}

export default AuthPage;
