import { Icon } from '@iconify/react';

interface HeaderLogoProps {
  variant?: 'dark' | 'light';
}

export function HeaderLogo({ variant = 'dark' }: HeaderLogoProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5">
      <Icon 
        icon="lucide:book-open-text" 
        className="w-8 h-8 text-emerald-400" 
      />
      <p className={`font-playfair font-bold text-2xl tracking-tight ${variant === 'light' ? 'text-white' : 'text-main-background-green'}`}>
        Emprestô
      </p>
    </div>
  );
}

export default HeaderLogo;