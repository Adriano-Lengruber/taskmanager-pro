import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { resilientToast } from '../utils/resilientToast';
import { useLanguage } from '../contexts/LanguageContext';
import LoadingSpinner from '../components/LoadingSpinner';
import type { UserLogin } from '../types/api';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
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
    e.stopPropagation();
    
    setIsLoading(true);
    setError('');

    try {
      await login(formData);
      
      // Toast de sucesso usando ResilientToast
      resilientToast.success(t.auth.loginSuccess);
      
      // Redirecionamento será automático pelo ProtectedRoute
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
    } catch (err: any) {
      // Preparar mensagem de erro
      let errorMessage = 'Erro ao fazer login';
      
      if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.response?.status === 401) {
        errorMessage = 'Credenciais inválidas. Verifique seu usuário e senha.';
      } else if (err.response?.status === 422) {
        errorMessage = 'Dados inválidos. Verifique as informações fornecidas.';
      } else if (err.response?.status >= 500) {
        errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
      } else if (err.code === 'NETWORK_ERROR' || err.code === 'ERR_NETWORK') {
        errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.';
      } else if (err.code === 'ECONNREFUSED') {
        errorMessage = 'Servidor temporariamente indisponível. Tente novamente em alguns instantes.';
      }
      
      setError(errorMessage);
      
      // Usar ResilientToast que é imune a re-renders e alerts
      resilientToast.error(errorMessage, { duration: 15000 }); // 15 segundos para erros de login
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 50);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t.auth.login}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t.auth.dontHaveAccount}{' '}
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              {t.auth.register}
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                {t.auth.email}
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder={t.auth.email}
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                {t.auth.password}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder={t.auth.password}
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                t.auth.loginButton
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
