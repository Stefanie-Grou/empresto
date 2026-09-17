import { Icon } from '@iconify/react';

export default function Sidebar() {
    return (
        <aside>
            <div className="font-inter text-secondary-light-gray text-s">
                <div className='center-horizontally w-3xs p-3'>
                    <Icon
                        icon="lucide:chart-column"
                    />
                    <p className='pl-5'>Visão Geral</p>
                </div>

                <p className='uppercase text-xs font-semibold'>Estante</p>

                <div className='center-horizontally w-3xs p-3'>
                    <Icon
                        icon="lucide:book-search"
                    />
                    <p className='pl-5'>Acervo</p>
                </div>

                <p className='uppercase text-xs font-semibold'>Movimentação</p>

                <div className='center-horizontally w-3xs p-3'>
                    <Icon
                        icon="lucide:stamp"
                    />
                    <p className='pl-5'>Empréstimos</p>
                </div>
                <div className='center-horizontally w-3xs p-3'>
                    <Icon
                        icon="lucide:calendar-days"
                    />
                    <p className='pl-5'>Reservas</p>
                </div>
                <div className='center-horizontally w-3xs p-3'>
                    <Icon
                        icon="lucide:clipboard-plus"
                    />
                    <p className='pl-5'>Relatórios</p>
                </div>
            </div>
        </aside>
    )
}