import HeaderLogo from '../assets/HeaderLogo';

export function Welcome() {
  return (
    <div className="w-full h-full bg-transparent lg:bg-gradient-to-b lg:from-[#092B20] lg:via-[#0D382A] lg:to-[#124B38] rounded-none lg:rounded-[28px] xl:rounded-[32px] text-white flex flex-col justify-center lg:justify-end p-5 sm:p-7 lg:p-12 xl:p-14 select-none">
      <div className="lg:hidden mb-5 flex justify-center">
        <HeaderLogo variant="light" />
      </div>

      <div className="lg:hidden text-center mb-6">
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

      <div className="hidden lg:flex flex-row items-end justify-between gap-6 mb-8">
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

      <div className="grid grid-cols-3 gap-2.5 sm:gap-3 w-full max-w-[340px] sm:max-w-[400px] lg:max-w-none mx-auto">
        <div className="bg-[#0A2E22]/80 border border-white/10 rounded-2xl p-3 sm:p-4 flex flex-col justify-between min-h-[88px] sm:min-h-[96px] backdrop-blur-xs">
          <span className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-300 text-[11px] sm:text-xs font-semibold flex items-center justify-center">1</span>
          <p className="font-jakarta text-white font-medium text-[11px] sm:text-xs leading-tight sm:leading-snug mt-2.5 sm:mt-3">Crie sua conta</p>
        </div>

        <div className="bg-[#0A2E22]/80 border border-white/10 rounded-2xl p-3 sm:p-4 flex flex-col justify-between min-h-[88px] sm:min-h-[96px] backdrop-blur-xs">
          <span className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-300 text-[11px] sm:text-xs font-semibold flex items-center justify-center">2</span>
          <p className="font-jakarta text-white font-medium text-[11px] sm:text-xs leading-tight sm:leading-snug mt-2.5 sm:mt-3">Cadastre o acervo</p>
        </div>

        <div className="bg-[#0A2E22]/80 border border-white/10 rounded-2xl p-3 sm:p-4 flex flex-col justify-between min-h-[88px] sm:min-h-[96px] backdrop-blur-xs">
          <span className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-300 text-[11px] sm:text-xs font-semibold flex items-center justify-center">3</span>
          <p className="font-jakarta text-white font-medium text-[11px] sm:text-xs leading-tight sm:leading-snug mt-2.5 sm:mt-3">Libere empréstimos</p>
        </div>
      </div>
    </div>
  );
}

export default Welcome;