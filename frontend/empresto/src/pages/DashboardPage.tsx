import StatCard from "../MainElements/Card";
import DashboardHeader from "./DashboardHeader";

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-6 w-full p-8 bg-gray-50">
            <div>
                <DashboardHeader />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full bg-gray-50 p-8">
                <StatCard
                    title="Itens no acervo"
                    subtitle="Total de itens cadastrados"
                    value="12.480"
                    statsHighlight="+86"
                    statsLabel="neste mês"
                    icon="book-open-text"
                />
                <StatCard
                    title="Empréstimo"
                    subtitle="Total de empréstimos ativos"
                    value="328"
                    statsHighlight="+24"
                    statsLabel="hoje"
                    icon="stamp"
                />
                <StatCard
                    title="Devoluções"
                    subtitle="Total de devoluções para hoje"
                    value="47"
                    statsHighlight="+12"
                    statsLabel="pendentes"
                    icon="calendar-check"
                />
                <StatCard
                    title="Devoluções"
                    subtitle="Total de devoluções para hoje"
                    value="47"
                    statsHighlight="+12"
                    statsLabel="pendentes"
                    icon="triangle-alert"
                />
            </div>
        </div>
    );
} 