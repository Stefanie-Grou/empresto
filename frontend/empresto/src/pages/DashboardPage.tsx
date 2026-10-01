import StatCard from "../MainElements/Card";
import DashboardHeader from "./DashboardHeader";
import RecentLoans from "../MainElements/RecentLoans";
import QuickActions from "../MainElements/QuickActions";

export default function DashboardPage() {
  return (
    <div className="h-screen w-full overflow-y-hidden flex flex-col gap-6 p-8 bg-main-background-gray">
      <DashboardHeader />

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

      <div className="grid lg:grid-cols-3 gap-6 min-h-0">
        <div className="lg:col-span-2 flex flex-col">
          <RecentLoans />
        </div>
          <QuickActions />
      </div>
    </div>
  );
}