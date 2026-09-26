import { Icon } from '@iconify/react';

export function HeaderLogo() {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Icon 
        icon="lucide:book-open-text" 
        className="w-8 h-8 text-emerald-400" 
      />
      <p className="font-playfair text-main-background-green font-bold text-2xl pl-5 mb-10">Emprestô</p>
    </div>
  );
}

export default HeaderLogo;