import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isAuthenticated } from './services/session';

export default function ProtectedRoute() {
  const location = useLocation();

  if (!isAuthenticated()) {
    // "/" é a tela de login (AuthPage escolhe o formulário pelo pathname)
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
