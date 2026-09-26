function Welcome() {
    return (
        <div className="min-h-screen bg-linear-to-b from-70% from-main-background-green to-background-lighter-green rounded-lg text-white flex flex-col justify-end gap-12 p-12">

            <div className="grid grid-cols-2 gap-20 items-center text-secondary-light-gray">
                <h1 className="font-jakarta text-4xl leading-15 font-semibold">
                    Boas-vindas ao Emprestô
                </h1>
                <p className="font-inter text-xs">
                    Siga estes 3 passos simples para organizar sua sala de leitura.
                </p>
            </div>

            {/* 2. Bloco dos Cards (ficará no rodapé) */}
            <div className="grid grid-cols-3 gap-2 w-full">
                <div className="welcome-inferior-card">
                    <span className="welcome-inferior-number">1</span>
                    <p className="welcome-inferior-text">Crie sua conta</p>
                </div>

                <div className="welcome-inferior-card">
                    <span className="welcome-inferior-number">2</span>
                    <p className="welcome-inferior-text">Cadastre o acervo</p>
                </div>

                <div className="welcome-inferior-card">
                    <span className="welcome-inferior-number">3</span>
                    <p className="welcome-inferior-text">Libere empréstimos</p>
                </div>
            </div>

        </div>
    );
}
export default Welcome;