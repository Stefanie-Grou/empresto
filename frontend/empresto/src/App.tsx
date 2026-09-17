import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import LoginForm from './login/LoginFormData'
import Welcome from './login/Welcome'


function DashboardPage() {
  return (
    <div className="p-8 font-inter">
      <h1 className="text-3xl font-bold">Painel do Emprestô</h1>
      <p>Bem-vindo ao sistema de controle do acervo!</p>
    </div>
  );
}

function LoginPage() {
  return (
    <div className="App grid grid-cols-2 w-full min-h-screen font-inter">
      <Welcome />
      <LoginForm />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota inicial (Login) */}
        <Route path="/" element={<LoginPage />} />

        {/* Rota do Dashboard */}
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}