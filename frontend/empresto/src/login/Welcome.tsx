export function Welcome() {
  return (
    <div className="h-full min-h-screen bg-linear-to-b from-70% from-main-background-green to-background-lighter-green text-white flex flex-col justify-between p-8 xl:p-14">
      <div className="flex items-center gap-2">
        <span className="inline-block w-3 h-3 rounded-full bg-secondary-light-green"></span>
        <span className="font-jakarta text-xs uppercase tracking-widest text-secondary-light-gray font-semibold">
          PEI EE Amélia dos Anjos Oliveira
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-center text-secondary-light-gray my-auto py-10">
        <h1 className="font-jakarta text-3xl xl:text-4xl leading-tight font-semibold text-white">
          Boas-vindas ao Emprestô
        </h1>
        <p className="font-inter text-sm text-secondary-light-gray leading-relaxed">
          Siga estes 3 passos simples para organizar a sala de leitura com facilidade.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
        <div className="welcome-inferior-card">
          <span className="welcome-inferior-number">1</span>
          <p className="welcome-inferior-text">Acesse com sua conta</p>
        </div>

        <div className="welcome-inferior-card">
          <span className="welcome-inferior-number">2</span>
          <p className="welcome-inferior-text">Organize o acervo</p>
        </div>

        <div className="welcome-inferior-card">
          <span className="welcome-inferior-number">3</span>
          <p className="welcome-inferior-text">Libere os empréstimos</p>
        </div>
      </div>
    </div>
  );
}

export default Welcome;