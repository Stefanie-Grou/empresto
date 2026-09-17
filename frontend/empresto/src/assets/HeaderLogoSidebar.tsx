import { Icon } from '@iconify/react';

export function HeaderLogoSidebar() {
  return (
    <div className="center-horizontally gap-2">
      <Icon
        icon="lucide:book-open-text"
        className="w-8 h-8 text-emerald-400"
      />
      <div className='text-white-background'>
        <p className="font-playfair font-bold text-2xl">Emprestô</p>
        <p className='font-kumbh text-sx'>Gestão de Biblioteca</p>
      </div>
    </div>
  );
}

export default HeaderLogoSidebar;