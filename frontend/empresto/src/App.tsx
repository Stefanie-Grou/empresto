import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginForm from './login/LoginFormData';
import Welcome from './login/Welcome'
import DashboardHome from './dashboard/DashboardHome';


function DashboardHomePage() {
  return (
    <DashboardHome />
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
        <Route path="/" element={<LoginPage />} />

        <Route path="/dashboard" element={<DashboardHomePage />} />
      </Routes>
    </BrowserRouter>
  );
}