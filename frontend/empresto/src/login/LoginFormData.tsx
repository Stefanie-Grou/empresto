import { useState, type SubmitEvent } from 'react';
import HeaderLogo from "../assets/HeaderLogo";

interface LoginFormData {
    usuario: string;
    senha: string;
}

export function LoginForm() {
    const [formData, setFormData] = useState<LoginFormData>({
        usuario: '',
        senha: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (field: keyof LoginFormData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    /*
    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('E-mail ou senha incorretos.');
            }

        } catch (error: any) {
            setErrorMessage(error.message || 'Erro ao conectar com o servidor.');
        } finally {
            setIsLoading(false);
        }

    };
    */

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 1500));

        console.log('Login simulado com sucesso:', formData);
        setIsLoading(false);
    };


    return (
        <div className="bg-white-background p-10 flex flex-col justify-center">
            <HeaderLogo />

            <div className="font-inter text-center mt-4">
                <h1 className="text-2xl font-semibold">Entre com sua conta</h1>
                <p className="text-medium-gray text-sm">
                    Por favor, insira seus dados para entrar na sua conta.
                </p>
            </div>

            {errorMessage && (
                <div className="mt-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg text-center">
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="text-medium-gray flex flex-col gap-4 mt-6">

                <div className="flex flex-col">
                    <label className="form-label">E-mail</label>
                    <input
                        type="email"
                        className="form-input"
                        placeholder="Digite seu e-mail"
                        value={formData.usuario}
                        onChange={(e) => handleChange('usuario', e.target.value)}
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <label className="form-label">Senha</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-input"
                        placeholder="Digite sua senha"
                        value={formData.senha}
                        onChange={(e) => handleChange('senha', e.target.value)}
                        required
                    />
                </div>

                <div className="login-options">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showPassword}
                            onChange={(e) => setShowPassword(e.target.checked)}
                            className="rounded"
                        />
                        <span>Mostrar senha</span>
                    </label>

                    <p className="text-main-background-green">
                        <a href="#">Esqueceu a senha?</a>
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="buttons w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isLoading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>

            <p className="text-medium-gray text-sm text-center mt-6">
                Não tem conta? <a className="font-semibold text-main-background-green" href="#">Clique aqui</a> para cadastrar
            </p>
        </div>
    );
}

export default LoginForm;