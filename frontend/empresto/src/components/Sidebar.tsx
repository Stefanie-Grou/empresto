import { Icon } from '@iconify/react';
import { NavLink } from 'react-router-dom';
import HeaderLogoSidebar from "../assets/HeaderLogoSidebar"

export default function Sidebar() {

    const linkStyle = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-emerald-800 ${isActive ? 'bg-emerald-900 font-semibold text-white' : 'text-secondary-light-gray'
        } 'justify-center'' : ''}`;

    return (

        <div className='bg-main-background-green pt-5 pb-5 pl-5 pr-10'>
            <HeaderLogoSidebar />

            <aside
                className={`min-h-screen transition-all duration-300 p-4 flex flex-col font-inter'w-64'
                    }`}
            >
                <nav className="flex flex-col gap-2">
                    <NavLink to="/dashboard" className={linkStyle}>
                        <Icon icon="lucide:chart-column" className="w-6 h-6" />
                        <span>Visão Geral</span>
                    </NavLink>

                        <p className="sidebar-static-texts">
                            Estante
                        </p>

                    <NavLink to="/acervo" className={linkStyle}>
                        <Icon icon="lucide:book-search" className="w-6 h-6" />
                        <span>Acervo</span>
                    </NavLink>

                        <p className="sidebar-static-texts">
                            Movimentação
                        </p>
                    <NavLink to="/emprestimos" className={linkStyle}>
                        <Icon icon="lucide:stamp" className="w-6 h-6" />
                        <span>Empréstimos</span>
                    </NavLink>

                    <NavLink to="/reservas" className={linkStyle}>
                        <Icon icon="lucide:calendar-days" className="w-6 h-6" />
                        <span>Reservas</span>
                    </NavLink>

                    <NavLink to="/relatorios" className={linkStyle}>
                        <Icon icon="lucide:clipboard-plus" className="w-6 h-6" />
                        <span>Relatórios</span>
                    </NavLink>
                </nav>
            </aside>
        </div>

    );
}