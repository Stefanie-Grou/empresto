import { Icon } from '@iconify/react';

export default function DashboardHeader() {
  function getGreeting(): string {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      return 'Bom dia';
    } else if (currentHour < 18) {
      return 'Boa tarde';
    } else {
      return 'Boa noite';
    }
  }

  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const capitalizedDate =
    formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  const greetingByPeriodOfDay = getGreeting();

  return (
    <div className="w-full flex justify-between items-center font-inter">
      <div className="flex flex-col">
        <h2 className="text-3xl font-playfair font-bold leading-tight">
          {greetingByPeriodOfDay},
        </h2>

        <p className="text-sm text-gray-500 font-sans">
          {capitalizedDate}.
        </p>
      </div>

      <button
        type="button"
        className="buttons bg-main-background-green flex items-center gap-2 cursor-pointer"
      >
        <Icon icon="lucide:plus" className="w-4 h-4" />
        <span>Novo empréstimo</span>
      </button>
    </div>
  );
}