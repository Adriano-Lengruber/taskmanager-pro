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
    username: 'invalid_user',
    password: 'wrong_password'
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
    console.log('🔥🔥🔥 LOGIN: handleSubmit iniciado com dados:', formData);
    console.log('🔥🔥🔥 LOGIN: Username:', formData.username);
    console.log('🔥🔥🔥 LOGIN: Password length:', formData.password.length);
    setIsLoading(true);
    setError('');

    console.log('Login: Form submitted', formData.username);

    try {
      console.log('Login: Calling login function...');
      const result = await login(formData);
      console.log('Login: Success! Result:', result);
      console.log('Login: Redirecting to dashboard...');
      
      // Toast de sucesso usando ResilientToast
      resilientToast.success(t.auth.loginSuccess);
      
      // Redirecionamento será automático pelo ProtectedRoute
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
    } catch (err: any) {
      console.log('🔥🔥🔥 LOGIN: ========== ENTROU NO CATCH ==========');
      console.error('🔥🔥🔥 LOGIN: Error occurred:', err);
      console.error('🔥🔥🔥 LOGIN: Error response:', err.response);
      console.error('🔥🔥🔥 LOGIN: Error status:', err.response?.status);
      console.error('🔥🔥🔥 LOGIN: Error data:', err.response?.data);
      
      // Preparar mensagem de erro
      let errorMessage = 'Erro ao fazer login';
      
      if (err.response?.status === 401) {
        errorMessage = 'Credenciais inválidas. Verifique seu usuário e senha.';
      } else if (err.response?.status === 422) {
        errorMessage = 'Dados de login inválidos. Verifique se você preencheu todos os campos corretamente.';
      } else if (err.response?.status === 400) {
        errorMessage = 'Usuário inativo ou bloqueado. Entre em contato com o administrador.';
      } else if (err.response?.data?.detail) {
        if (typeof err.response.data.detail === 'string') {
          errorMessage = err.response.data.detail;
        } else if (Array.isArray(err.response.data.detail)) {
          errorMessage = 'Erro nos dados fornecidos. Verifique se todos os campos estão preenchidos corretamente.';
        }
      } else if (err.message === 'Network Error') {
        errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.';
      } else if (err.code === 'ECONNREFUSED') {
        errorMessage = 'Servidor temporariamente indisponível. Tente novamente em alguns instantes.';
      }
      
      console.log('🔥🔥🔥 LOGIN: Definindo erro no estado:', errorMessage);
      setError(errorMessage);
      
      // SOLUÇÃO DEFINITIVA: Usar ResilientToast que é imune a re-renders e alerts
      console.log('🔥🔥🔥 LOGIN: Exibindo toast de erro com ResilientToast...');
      console.log('🔥🔥🔥 LOGIN: Mensagem do erro:', errorMessage);
      console.log('🔥🔥🔥 LOGIN: Typeof resilientToast:', typeof resilientToast);
      console.log('🔥🔥🔥 LOGIN: resilientToast.error:', typeof resilientToast.error);
      
      // Chamar o toast - AGORA COM PROTEÇÃO CONTRA BEFOREUNLOAD e DURAÇÃO MAIOR
      const toastId = resilientToast.error(errorMessage, { duration: 15000 }); // 15 segundos para erros de login
      console.log('🔥🔥🔥 LOGIN: Toast ID retornado:', toastId);
      
      // Para debug/comparação, também exibir no console
      console.log('🔥🔥🔥 LOGIN: ✅ Erro exibido via ResilientToast - PROTEGIDO!');
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        console.log('🔥🔥🔥 LOGIN: Loading definido como false');
      }, 50);
    }
  };

  // Nova função para interceptar o clique do botão
  const handleButtonClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔥🔥🔥 LOGIN BUTTON: Clique interceptado!', e);
    console.log('🔥🔥🔥 LOGIN BUTTON: Form data atual:', formData);
    
    // Verificar se os campos estão preenchidos
    if (!formData.username || !formData.password) {
      console.log('🔥🔥🔥 LOGIN BUTTON: Campos vazios detectados!');
      console.log('🔥🔥🔥 LOGIN BUTTON: Username:', formData.username);
      console.log('🔥🔥🔥 LOGIN BUTTON: Password length:', formData.password.length);
      return;
    }
    
    console.log('🔥🔥🔥 LOGIN BUTTON: Chamando handleSubmit...');
    
    // Criar um evento sintético de form para passar para handleSubmit
    const syntheticEvent = {
      preventDefault: () => {
        console.log('🔥🔥🔥 SYNTHETIC EVENT: preventDefault chamado');
      },
      stopPropagation: () => {
        console.log('🔥🔥🔥 SYNTHETIC EVENT: stopPropagation chamado');
      },
    } as React.FormEvent;
    
    await handleSubmit(syntheticEvent);
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

        <div className="mt-8 space-y-6">
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
              type="button"
              disabled={isLoading}
              onClick={handleButtonClick}
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
        </div>
      </div>
    </div>
  );
};

export default Login;
