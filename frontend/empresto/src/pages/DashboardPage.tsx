import StatCard from "../MainElements/Card";

export default function DashboardPage() {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <div>
                <div>
                    <h1>Bom dia estático</h1>
                    <p>Data estático</p>
                </div>
                <button
                    type="submit"
                    className="buttons">
                    <p>Novo Empréstimo</p>
                </button>
            </div>
            <div className="flex flex-wrap items-center gap-6 w-full">
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