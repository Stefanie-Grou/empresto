import { Icon } from '@iconify/react';

export function HeaderLogo() {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5">
      <Icon 
        icon="lucide:book-open-text" 
        className="w-8 h-8 text-emerald-500" 
      />
      <p className="font-playfair text-main-background-green font-bold text-2xl tracking-tight">Emprestô</p>
    </div>
  );
}

export default HeaderLogo;