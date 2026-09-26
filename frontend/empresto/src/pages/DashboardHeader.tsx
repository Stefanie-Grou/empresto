import { Icon } from '@iconify/react';

export default function DashboardHeader() {
    const formattedDate = new Intl.DateTimeFormat('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(new Date());

    const capitalizedDate =
        formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

    return (
        <div className="w-full flex justify-between items-center mb-8 font-inter">
            <div className="flex flex-col">
                <h2 className="text-3xl font-playfair font-bold text-gray-900 leading-tight">
                    Bom dia,
                </h2>

                <p className="text-sm text-gray-500 font-sans mt-1">
                    {capitalizedDate}.
                </p>
            </div>

            <button
                type="button"
                className="buttons flex items-center gap-2 cursor-pointer"
            >
                <Icon icon="lucide:plus" className="w-4 h-4" />
                <span>Novo empréstimo</span>
            </button>
        </div>
    );
}