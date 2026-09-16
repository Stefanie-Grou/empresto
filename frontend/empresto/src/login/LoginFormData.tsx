import HeaderLogo  from "../assets/HeaderLogo";

interface LoginFormData {
    email: string;
    password: string
}

function LoginForm() {
    return (
        <div className="w-100vm bg-white-background p-45">

            <div>
                <HeaderLogo />
            </div>

            <div className="font-inter text-center">
                <h1 className="text-2xl font-semibold">Entre com sua conta</h1>
                <p className="text-medium-gray text-sm">Por favor, insira seus dados para entrar na sua conta.</p>
            </div>

            <form className="text-medium-gray flex flex-col mt-5 mb-5">
                <label className="form-label">Usuário</label>
                <input className= "form-input" placeholder="Digite seu usuário" />

                <label className="form-label">Senha</label>
                <input className= "form-input" placeholder="Digite sua senha" />
            </form>

            <div className='login-options text-center font-jakarta text-medium-gray text-sm'>
                <label className="p-5" >
                    <input type='checkbox' /> Mostrar senha
                </label>
                <p className="text-main-background-green"><a href="#">Esqueceu a senha?</a></p>
            </div>

            <button className = "font-jakarta p-5 bg-main-background-green rounded text-white-background" type='submit'>Entrar</button>

            <p className="text-medium-gray text-sm text-center">Não tem conta? <a className = "font-semibold" href='#'>Clique aqui</a> para cadastrar</p>
        </div>
    )
}

export default LoginForm;