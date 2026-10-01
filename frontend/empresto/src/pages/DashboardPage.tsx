import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import StatCard from "../MainElements/Card";
import DashboardHeader from "./DashboardHeader";
import RecentLoans from "../MainElements/RecentLoans";
import QuickActions from "../MainElements/QuickActions";
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
    <div className="h-screen w-full overflow-y-hidden flex flex-col gap-6 p-8 bg-main-background-gray relative">
      {/* 1. Cabeçalho */}
      <DashboardHeader />

      {/* 2. Grid de Cards de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full shrink-0">
        <StatCard
          title="Itens no acervo"
          subtitle="Total de itens cadastrados"
          value="12.480"
          statsHighlight="+86"
          statsLabel="neste mês"
          icon="book-open-text"
          colorVariable="var(--color-secondary-light-green)"
        />
        <StatCard
          title="Empréstimos"
          subtitle="Total de empréstimos ativos"
          value="328"
          statsHighlight="+24"
          statsLabel="hoje"
          icon="stamp"
          colorVariable="var(--color-soft-blue)"
        />
        <StatCard
          title="Devoluções"
          subtitle="Total de devoluções para hoje"
          value="47"
          statsHighlight="+12"
          statsLabel="pendentes"
          icon="calendar-check"
          colorVariable="var(--color-soft-yellow)"
        />
        <StatCard
          title="Em atraso"
          subtitle="Total de itens em atraso"
          value="18"
          statsHighlight="Requer atenção"
          icon="triangle-alert"
          colorVariable="var(--color-soft-red)"
        />
      </div>

      {/* 3. Seção Inferior: Tabela + Ações */}
      <div className="grid lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-2 min-h-0 flex flex-col">
          <RecentLoans />
        </div>
        <div className="lg:col-span-1 min-h-0">
          <QuickActions />
        </div>
      </div>

      {/* 4. Feedback de Toast */}
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