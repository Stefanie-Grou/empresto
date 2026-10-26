import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import StatCard from "../components/Card";
import DashboardHeader from "./DashboardHeader";
import RecentLoans from '../components/RecentLoans';
import QuickActions from '../components/QuickActions';
import Toast from '../components/Toast';
import NewLoanModal from '../components/NewLoanModal';
import { MOCK_LOANS } from '../mocks/mock_loans';
import type { LoanItem } from '../interfaces/LoanItem';

interface DashboardStats {
  acervo: {
    totalExemplares: number;
    totalDisponiveis: number;
    totalTitulos: number;
    novosEsteMes: number;
  };
  emprestimos: {
    ativos: number;
    emprestimosHoje: number;
    devolucoesVencendoHoje: number;
    devolucoesHoje: number;
    atrasados: number;
  };
}

export default function DashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Login realizado com sucesso! Bem-vindo(a) ao Emprestô.');
  const [isNewLoanModalOpen, setIsNewLoanModalOpen] = useState(false);
  const [loans, setLoans] = useState<LoanItem[]>(MOCK_LOANS);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/v1/dashboard/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Erro ao buscar estatísticas do dashboard:', err);
    }
  };

  const fetchLoans = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/v1/emprestimos');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // Se o banco retornou dados, exibe somente os registros reais
          const dbLoans: LoanItem[] = data.map((item: any) => ({
            id: String(item.id ?? item.id_emprestimo),
            bookTitle: item.bookTitle || item.livroTitulo || item.livro_titulo || 'Livro',
            bookAuthor: item.bookAuthor || item.livroAutor || item.livro_autor || 'Autor',
            userName: item.studentName || item.pessoaNome || item.pessoa_nome || 'Leitor',
            classGroup: item.studentClass || item.turma || item.pessoa_turma || '-',
            userType: item.userType || item.tipoPessoa || item.pessoaTipo || item.pessoa_tipo || 'Aluno',
            dueDate: item.dueDate || item.prazoDevolucao || item.rawDueDate || '-',
            itemType: item.itemType || item.itemTipo || 'Livro',
          }));
          setLoans(dbLoans);
        }
      }
    } catch (err) {
      console.error('Erro ao consultar empréstimos no backend:', err);
    }
  };

  const refreshAll = () => {
    fetchLoans();
    fetchStats();
  };

  useEffect(() => {
    fetchLoans();
    fetchStats();
  }, []);

  useEffect(() => {
    const isRegisterState = location.state?.registerSuccess;
    const isRegisterStorage = sessionStorage.getItem('register_success');
    const isLoginState = location.state?.loginSuccess;
    const isLoginStorage = sessionStorage.getItem('login_success');

    if (isRegisterState || isRegisterStorage) {
      setToastMessage('Cadastro realizado com sucesso! Bem-vindo(a) ao Emprestô.');
      setShowToast(true);
      sessionStorage.removeItem('register_success');
      navigate(location.pathname, { replace: true, state: {} });
    } else if (isLoginState || isLoginStorage) {
      setToastMessage('Login realizado com sucesso! Bem-vindo(a) ao Emprestô.');
      setShowToast(true);
      sessionStorage.removeItem('login_success');
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // Formata número com separador de milhar (ex: 1234 → "1.234")
  const fmt = (n: number | undefined | null): string => {
    if (n == null) return '—';
    return n.toLocaleString('pt-BR');
  };

  return (
    <div className="h-screen w-full overflow-y-hidden flex flex-col gap-6 p-8 bg-main-background-gray relative">
      <DashboardHeader onNewLoanClick={() => setIsNewLoanModalOpen(true)} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full shrink-0">
        <StatCard
          title="Itens no acervo"
          subtitle="Total de itens cadastrados"
          value={fmt(stats?.acervo.totalExemplares)}
          statsHighlight={stats ? `+${fmt(stats.acervo.novosEsteMes)}` : '—'}
          statsLabel="neste mês"
          icon="book-open-text"
          colorVariable="var(--color-secondary-light-green)"
        />
        <StatCard
          title="Empréstimos"
          subtitle="Total de empréstimos ativos"
          value={fmt(stats?.emprestimos.ativos)}
          statsHighlight={stats ? `+${fmt(stats.emprestimos.emprestimosHoje)}` : '—'}
          statsLabel="hoje"
          icon="stamp"
          colorVariable="var(--color-soft-blue)"
        />
        <StatCard
          title="Devoluções"
          subtitle="Total de devoluções para hoje"
          value={fmt(stats?.emprestimos.devolucoesVencendoHoje)}
          statsHighlight={stats ? `+${fmt(stats.emprestimos.devolucoesHoje)}` : '—'}
          statsLabel="realizadas hoje"
          icon="calendar-check"
          colorVariable="var(--color-soft-yellow)"
        />
        <StatCard
          title="Em atraso"
          subtitle="Total de itens em atraso"
          value={fmt(stats?.emprestimos.atrasados)}
          statsHighlight={stats && stats.emprestimos.atrasados > 0 ? 'Requer atenção' : 'Em dia'}
          icon="triangle-alert"
          colorVariable="var(--color-soft-red)"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-2 min-h-0 flex flex-col">
          <RecentLoans loans={loans} />
        </div>
        <div className="lg:col-span-1 min-h-0">
          <QuickActions />
        </div>
      </div>

      <NewLoanModal
        isOpen={isNewLoanModalOpen}
        onClose={() => setIsNewLoanModalOpen(false)}
        onLoanCreated={() => refreshAll()}
      />

      {showToast && (
        <Toast
          type="success"
          title="Sucesso"
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}