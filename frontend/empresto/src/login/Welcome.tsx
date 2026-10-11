import HeaderLogo from '../assets/HeaderLogo';

interface WelcomeProps {
  variant?: 'mobile' | 'desktop';
}

export function Welcome({ variant = 'desktop' }: WelcomeProps) {
  if (variant === 'mobile') {
    return (
      <div className="w-full text-white flex flex-col items-center text-center select-none">
        <div className="mb-5 flex justify-center">
          <HeaderLogo variant="light" />
        </div>

        <div className="text-center mb-6">
          <h1 className="font-jakarta text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
            Seja bem-vindo
          </h1>
          <p className="font-jakarta text-2xl sm:text-3xl font-bold text-white leading-tight">
            ao <span className="font-playfair font-normal">Emprestô</span>
          </p>
          <p className="font-inter text-xs text-white/75 max-w-[260px] mx-auto mt-2 leading-relaxed">
            Siga estes 3 passos simples para organizar sua sala de leitura.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 w-full max-w-[340px] mx-auto">
          <div className="bg-[#0A2E22]/80 border border-white/10 rounded-2xl p-3 flex flex-col justify-between min-h-[86px] backdrop-blur-xs">
            <span className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-300 text-[11px] font-semibold flex items-center justify-center">1</span>
            <p className="font-jakarta text-white font-medium text-[11px] leading-tight mt-2">Crie sua conta</p>
          </div>

          <div className="bg-[#0A2E22]/80 border border-white/10 rounded-2xl p-3 flex flex-col justify-between min-h-[86px] backdrop-blur-xs">
            <span className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-300 text-[11px] font-semibold flex items-center justify-center">2</span>
            <p className="font-jakarta text-white font-medium text-[11px] leading-tight mt-2">Cadastre o acervo</p>
          </div>

          <div className="bg-[#0A2E22]/80 border border-white/10 rounded-2xl p-3 flex flex-col justify-between min-h-[86px] backdrop-blur-xs">
            <span className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-300 text-[11px] font-semibold flex items-center justify-center">3</span>
            <p className="font-jakarta text-white font-medium text-[11px] leading-tight mt-2">Libere empréstimos</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-b from-[#092B20] via-[#0D382A] to-[#124B38] rounded-[28px] lg:rounded-[32px] text-white flex flex-col justify-end p-8 sm:p-10 lg:p-12 xl:p-14 select-none">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="font-jakarta text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
            Seja bem-vindo
          </h1>
          <p className="font-jakarta text-3xl lg:text-4xl font-bold text-white leading-tight">
            ao <span className="font-playfair font-normal">Emprestô</span>
          </p>
        </div>
        <p className="font-inter text-xs text-white/70 max-w-[210px] leading-relaxed">
          Siga estes 3 passos simples para organizar sua sala de leitura.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full">
        <div className="bg-[#0A2E22]/80 border border-white/10 rounded-2xl p-4 flex flex-col justify-between min-h-[96px] backdrop-blur-xs">
          <span className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-semibold flex items-center justify-center">1</span>
          <p className="font-jakarta text-white font-medium text-xs leading-snug mt-3">Crie sua conta</p>
        </div>

        <div className="bg-[#0A2E22]/80 border border-white/10 rounded-2xl p-4 flex flex-col justify-between min-h-[96px] backdrop-blur-xs">
          <span className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-semibold flex items-center justify-center">2</span>
          <p className="font-jakarta text-white font-medium text-xs leading-snug mt-3">Cadastre o acervo</p>
        </div>

        <div className="bg-[#0A2E22]/80 border border-white/10 rounded-2xl p-4 flex flex-col justify-between min-h-[96px] backdrop-blur-xs">
          <span className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-semibold flex items-center justify-center">3</span>
          <p className="font-jakarta text-white font-medium text-xs leading-snug mt-3">Libere empréstimos</p>
        </div>
      </div>
    </div>
  );
}

export default Welcome;