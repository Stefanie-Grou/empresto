import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

interface DropdownOptionsProps {
  userName?: string;
  userRole?: string;
}

export default function DropdownOptions({
  userName = 'Usuário',
  userRole = 'Role',
}: DropdownOptionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsOpen(false);
    navigate('/');
  };

  return (
    <div className="relative inline-block text-left font-inter">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center cursor-pointer p-1.5 rounded-xl hover:bg-gray-100/60 transition-colors"
      >
        {/* Avatar */}
        <div className="bg-main-background-green rounded-full flex items-center justify-center w-10 h-10 shrink-0">
          <Icon icon="lucide:user" className="w-6 h-6 text-emerald-300" />
        </div>

        <div className="text-main-background-green pl-3 text-left">
          <p className="font-semibold text-sm leading-tight">{userName}</p>
          <p className="text-xs opacity-80 leading-tight">{userRole}</p>
        </div>

        {/* Ícone de Chevron com rotação ao abrir */}
        <Icon
          icon="lucide:chevron-down"
          className={`w-5 h-5 text-main-background-green ml-3 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Menu Dropdown Suspenso */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <Icon icon="lucide:log-out" className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}