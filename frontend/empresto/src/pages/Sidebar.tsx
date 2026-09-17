import { useState } from 'react';
import { Icon } from '@iconify/react';
import { NavLink } from 'react-router-dom';
import HeaderLogoSidebar from "../assets/HeaderLogoSidebar"

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const linkStyle = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-emerald-800 ${isActive ? 'bg-emerald-900 font-semibold text-white' : 'text-secondary-light-gray'
        } ${isCollapsed ? 'justify-center' : ''}`;

    return (

        <div className='bg-main-background-green'>
            <HeaderLogoSidebar />

            <aside
                className={`min-h-screen transition-all duration-300 p-4 flex flex-col font-inter ${isCollapsed ? 'w-20' : 'w-64'
                    }`}
            >
                <nav className="flex flex-col gap-2">
                    <NavLink to="/dashboard" className={linkStyle}>
                        <Icon icon="lucide:chart-column" className="w-6 h-6 shrink-0" />
                        {!isCollapsed && <span>Visão Geral</span>}
                    </NavLink>

                    {!isCollapsed && (
                        <p className="uppercase text-xs font-semibold text-emerald-300 mt-4 px-3">
                            Estante
                        </p>
                    )}
                    <NavLink to="/acervo" className={linkStyle}>
                        <Icon icon="lucide:book-search" className="w-6 h-6 shrink-0" />
                        {!isCollapsed && <span>Acervo</span>}
                    </NavLink>

                    {!isCollapsed && (
                        <p className="uppercase text-xs font-semibold text-emerald-300 mt-4 px-3">
                            Movimentação
                        </p>
                    )}
                    <NavLink to="/emprestimos" className={linkStyle}>
                        <Icon icon="lucide:stamp" className="w-6 h-6 shrink-0" />
                        {!isCollapsed && <span>Empréstimos</span>}
                    </NavLink>

                    <NavLink to="/reservas" className={linkStyle}>
                        <Icon icon="lucide:calendar-days" className="w-6 h-6 shrink-0" />
                        {!isCollapsed && <span>Reservas</span>}
                    </NavLink>

                    <NavLink to="/relatorios" className={linkStyle}>
                        <Icon icon="lucide:clipboard-plus" className="w-6 h-6 shrink-0" />
                        {!isCollapsed && <span>Relatórios</span>}
                    </NavLink>
                </nav>
            </aside>
        </div>

    );
}