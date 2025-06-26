import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useLanguage } from '../contexts/LanguageContext';
import LoadingSpinner from '../components/LoadingSpinner';
import type { UserLogin } from '../types/api';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
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
    setIsLoading(true);
    setError('');

    console.log('Login: Form submitted', formData.username);

    try {
      console.log('Login: Calling login function...');
      await login(formData);
      console.log('Login: Success! Redirecting to dashboard...');
      showToast(t.auth.loginSuccess, 'success');
      
      // Redirecionamento será automático pelo ProtectedRoute
      // mas vamos garantir com navigate também
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
    } catch (err: any) {
      console.error('Login: Error occurred:', err);
      
      // Tratar diferentes tipos de erro
      let errorMessage = 'Erro de conexão. Verifique sua conexão com a internet.';
      
      try {
        if (err.response?.status === 401) {
          errorMessage = 'Email ou senha incorretos. Verifique suas credenciais e tente novamente.';
        } else if (err.response?.data?.detail) {
          errorMessage = err.response.data.detail;
        } else if (err.message) {
          errorMessage = err.message;
        }
      } catch (parseError) {
        console.error('Login: Error parsing error message:', parseError);
        errorMessage = 'Erro de conexão. Verifique sua conexão com a internet.';
      }
      
      setError(errorMessage);
      // Toast de erro com duração maior para login
      showToast(errorMessage, 'error', 10000); // 10 segundos para erros de login
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Bem-vindo ao TaskManager Pro
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Entre na sua conta
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
                {t.auth.email}
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="
                  mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg
                  shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500
                  focus:border-blue-500
                "
                placeholder="Digite seu e-mail"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t.auth.password}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="
                  mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg
                  shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500
                  focus:border-blue-500
                "
                placeholder="Digite sua senha"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="
                group relative w-full flex justify-center py-3 px-4 border border-transparent
                text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                t.auth.loginButton
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              {t.auth.dontHaveAccount}{' '}
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Cadastre-se aqui
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
