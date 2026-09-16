function Welcome() {
    return(
        <div>
            <h1>Boas-vindas ao Emprestô</h1>
            <p>Siga estes 3 passos simples para organizar sua sala de leitura.</p>

            <div className="welcome-inferior-card">
                <p className="welcome-inferior-number">1</p>
                <p className="welcome-inferior-text">Crie sua conta</p>
            </div>

            <div className="welcome-inferior-card">
                <p className="welcome-inferior-number">2</p>
                <p className="welcome-inferior-text">Cadastre o acervo</p>
            </div>

            <div className="welcome-inferior-card">
                <p className="welcome-inferior-number">3</p>
                <p className="welcome-inferior-text">Libere empréstimos</p>
            </div>

        </div>
    )
}
export default Welcome;