import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import StatCard from "../components/Card";
import DashboardHeader from "./DashboardHeader";
import RecentLoans from '../components/RecentLoans';
import QuickActions from '../components/QuickActions';
import Toast from '../components/Toast';
import NewLoanModal from '../components/NewLoanModal';
import { MOCK_LOANS } from '../mocks/mock_loans';
import type { LoanItem } from '../interfaces/LoanItem';
import { ENDPOINTS } from '../services/apiConfig';
import {
  dashboardService,
  EMPTY_DASHBOARD_SUMMARY,
  type DashboardSummary,
} from '../services/dashboardService';

const numberFormatter = new Intl.NumberFormat('pt-BR');

function formatCount(value: number): string {
  return numberFormatter.format(Number.isFinite(value) ? value : 0);
}

export default function DashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Login realizado com sucesso! Bem-vindo(a) ao Emprestô.');
  const [summary, setSummary] = useState<DashboardSummary>(EMPTY_DASHBOARD_SUMMARY);
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [isNewLoanModalOpen, setIsNewLoanModalOpen] = useState(false);
  const [loans, setLoans] = useState<LoanItem[]>(MOCK_LOANS);

  const fetchLoans = async () => {
    try {
      const res = await fetch(ENDPOINTS.LOANS);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
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
  };

  useEffect(() => {
    fetchLoans();
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

  const loadSummary = useCallback(async () => {
    setIsLoadingSummary(true);
    try {
      const data = await dashboardService.getSummary();
      setSummary(data);
      setIsLoadingSummary(false);
    } catch {
      // O toast de erro é exibido pelo dashboardService
      setIsLoadingSummary(false);
    }
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  // Placeholder enquanto os números chegam do backend
  const displayValue = (value: number) => (isLoadingSummary ? '—' : formatCount(value));

  return (
    <div className="h-screen w-full overflow-y-hidden flex flex-col gap-6 p-8 bg-main-background-gray relative">
      <DashboardHeader onNewLoanClick={() => setIsNewLoanModalOpen(true)} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full shrink-0">
        <StatCard
          title="Itens no acervo"
          subtitle="Total de exemplares cadastrados"
          value={displayValue(summary.exemplaresTotal)}
          icon="book-open-text"
          colorVariable="var(--color-secondary-light-green)"
        />
        <StatCard
          title="Empréstimos"
          subtitle="Total de empréstimos ativos"
          value={displayValue(summary.emprestimosAtivos)}
          icon="stamp"
          colorVariable="var(--color-soft-blue)"
        />
        <StatCard
          title="Devoluções"
          subtitle="Total de devoluções para hoje"
          value={displayValue(summary.devolucoesHoje)}
          icon="calendar-check"
          colorVariable="var(--color-soft-yellow)"
        />
        <StatCard
          title="Em atraso"
          subtitle="Total de itens em atraso"
          value={displayValue(summary.emAtraso)}
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