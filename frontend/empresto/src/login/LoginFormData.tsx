interface LoginFormData {
    email: string;
    password: string
}

function LoginForm() {
    return (
        <div className="w-1/2 bg-white flex items-center justify-center">
            <h2>Entre com sua conta</h2>
            <h3>Por favor, insira seus dados para entrar na sua conta.</h3>

            <form>
                <label>Usuário</label>
                <input placeholder="Digite seu usuário" />

                <label>Senha</label>
                <input placeholder="Digite sua senha" />
            </form>

            <div className='login-options'>
                <label>
                    <input type='checkbox' /> Mostrar senha
                </label>
                <p><a href="#">Esqueceu a senha?</a></p>
            </div>

            <button type='submit'>Entrar</button>

            <p>Não tem conta? <a href='#'>Clique aqui</a> para cadastrar</p>
        </div>
    )
}

export default LoginForm;