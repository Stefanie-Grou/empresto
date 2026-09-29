import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';

export default function DashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const hasLoginSuccessState = location.state?.loginSuccess;
    const hasLoginSuccessStorage = sessionStorage.getItem('login_success');

    if (hasLoginSuccessState || hasLoginSuccessStorage) {
      setShowToast(true);
      sessionStorage.removeItem('login_success');
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <p>dashboard aqui</p>
      {showToast && (
        <Toast
          type="success"
          title="Sucesso"
          message="Login realizado com sucesso! Bem-vindo(a) ao Emprestô."
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}