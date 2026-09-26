import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginForm from './login/LoginFormData';
import Welcome from './login/Welcome';
import { MainLayout } from './MainElements/MainLayout';
import DashboardPage from './pages/DashboardPage';

function LoginPage() {
  return (
    <div className="App grid grid-cols-1 lg:grid-cols-2 w-full min-h-screen font-inter bg-white-background">
      <div className="hidden lg:block h-full">
        <Welcome />
      </div>
      <div className="w-full">
        <LoginForm />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/acervo" element={<div>Página do Acervo</div>} />
          <Route path="/emprestimos" element={<div>Página de Empréstimos</div>} />
          <Route path="/reservas" element={<div>Página de Reservas</div>} />
          <Route path="/relatorios" element={<div>Página de Relatórios</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}