import { Icon } from '@iconify/react';

export function HeaderLogo() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 mb-6">
      <div className="w-12 h-12 rounded-xl bg-main-background-green/10 flex items-center justify-center text-main-background-green">
        <Icon icon="lucide:book-open-text" className="w-7 h-7" />
      </div>
      <h2 className="font-playfair text-main-background-green font-bold text-3xl tracking-tight">Emprestô</h2>
    </div>
  );
}

export default HeaderLogo;