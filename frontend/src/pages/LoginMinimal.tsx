import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ultraDelayedToast } from '../utils/ultraDelayedToast';
import LoadingSpinner from '../components/LoadingSpinner';
import type { UserLogin } from '../types/api';

const LoginMinimal: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserLogin>({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('Login: Form submitted', formData.username);

    try {
      console.log('Login: Calling login function...');
      await login(formData);
      console.log('Login: Success! Redirecting to dashboard...');
      ultraDelayedToast.success('Login realizado com sucesso!');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
    } catch (err: any) {
      console.error('Login: Error occurred:', err);
      
      // Versão SIMPLIFICADA do tratamento de erro
      let errorMessage = 'Usuário ou senha incorretos. Verifique suas credenciais e tente novamente.';
      
      setError(errorMessage);
      console.log('🔥 Chamando ultraDelayedToast.error na página LOGIN MINIMAL...');
      ultraDelayedToast.error(errorMessage, 10000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            🔬 Login Minimal (Debug)
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Versão mínima para debug do toast
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
                placeholder="Digite seu e-mail"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
                placeholder="Digite sua senha"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white font-medium ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Entrando...</span>
                </div>
              ) : (
                'Entrar'
              )}
            </button>
          </div>

          <div className="text-center">
            <Link to="/register" className="text-blue-600 hover:text-blue-500">
              Ainda não tem uma conta? Cadastre-se
            </Link>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded">
            <h3 className="font-semibold mb-2">🔬 Debug Info:</h3>
            <div className="text-sm space-y-1">
              <div>• Removido: useLanguage context</div>
              <div>• Removido: tratamento complexo de erro</div>
              <div>• Simplificado: CSS classes</div>
              <div>• Mantido: Estrutura básica do login</div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginMinimal;
