import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import AuthPage from './login/AuthPage';
import { MainLayout } from './components/MainLayout';
import DashboardPage from './pages/DashboardPage';
import CollectionPage from './pages/CollectionPage';
import BookLendingPage from './pages/BookLendingPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage initialMode="login" />} />
        <Route path="/cadastro" element={<AuthPage initialMode="register" />} />

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/acervo" element={<CollectionPage />} />
          <Route path="/emprestimos" element={<BookLendingPage />} />
          <Route path="/reservas" element={<div>Página de Reservas</div>} />
          <Route path="/relatorios" element={<div>Página de Relatórios</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}