import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';
import AuthPage from './login/AuthPage';
import { MainLayout } from './components/MainLayout';
import DashboardPage from './pages/DashboardPage';
import CollectionPage from './pages/CollectionPage';
import BookLendingPage from './pages/BookLendingPage';
import ReservationPage from './pages/ReservationsPage';
import ReportsPage from './pages/ReportsPage';
import ProtectedRoute from './ProtectedRoute';
import { isAuthenticated } from './services/session';

// Já autenticado não precisa ver a tela de login: vai direto ao dashboard.
function AuthRoute({ initialMode }: { initialMode: 'login' | 'register' | 'forgot' | 'reset' }) {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <AuthPage initialMode={initialMode} />;
}

// Compatibilidade: "/login" não é uma rota da aplicação (a tela de login é "/").
function LegacyLoginRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/', { replace: true });
  }, [navigate]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthRoute initialMode="login" />} />
        <Route path="/cadastro" element={<AuthRoute initialMode="register" />} />
        <Route path="/esqueceu-senha" element={<AuthRoute initialMode="forgot" />} />
        <Route path="/redefinir-senha" element={<AuthRoute initialMode="reset" />} />
        <Route path="/login" element={<LegacyLoginRedirect />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/acervo" element={<CollectionPage />} />
            <Route path="/emprestimos" element={<BookLendingPage />} />
            <Route path="/reservas" element={<ReservationPage />} />
            <Route path="/relatorios" element={<ReportsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
