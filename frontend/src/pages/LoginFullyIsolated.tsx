import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ultraDelayedToast } from '../utils/ultraDelayedToast';
import apiClient from '../lib/api';
import type { UserLogin } from '../types/api';

const LoginFullyIsolated: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserLogin>({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log('🔥 LoginFullyIsolated: Campo alterado:', name, '=', value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const testToast = () => {
    console.log('🔥🔥🔥 LOGIN FULLY ISOLATED: Botão de teste clicado!');
    ultraDelayedToast.info('Toast de teste funcionando! (Fully Isolated)');
  };

  const doLoginDirect = async () => {
    console.log('🔥🔥🔥🔥🔥 LOGIN FULLY ISOLATED: doLoginDirect EXECUTADO!');
    console.log('🔥🔥🔥🔥🔥 LOGIN FULLY ISOLATED: Dados:', formData);
    
    setIsLoading(true);
    setError('');

    try {
      console.log('🔥🔥🔥🔥🔥 LOGIN FULLY ISOLATED: Fazendo requisição direta...');
      
      // Fazer requisição direta SEM usar AuthContext
      const requestData = new URLSearchParams();
      requestData.append('username', formData.username);
      requestData.append('password', formData.password);
      
      console.log('🔥🔥🔥🔥🔥 LOGIN FULLY ISOLATED: Form data criado:', requestData.toString());
      
      const response = await apiClient.post('/api/v1/auth/login', requestData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      console.log('✅ LOGIN FULLY ISOLATED: Sucesso! Response:', response.data);
      
      // Armazenar token diretamente no localStorage
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('auth_token', response.data.access_token);
      
      ultraDelayedToast.success('Login realizado com sucesso! (Fully Isolated)', 8000);
      
      // Navegar para dashboard após um delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      
    } catch (err: any) {
      console.error('🔥🔥🔥🔥🔥 LOGIN FULLY ISOLATED: Erro capturado:', err);
      console.error('🔥🔥🔥🔥🔥 LOGIN FULLY ISOLATED: Error response:', err.response);
      console.error('🔥🔥🔥🔥🔥 LOGIN FULLY ISOLATED: Error status:', err.response?.status);
      console.error('🔥🔥🔥🔥🔥 LOGIN FULLY ISOLATED: Error data:', err.response?.data);
      
      let errorMessage = 'Erro ao fazer login';
      if (err.response?.status === 401) {
        errorMessage = 'Credenciais inválidas. Tente novamente.';
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      }
      
      console.log('🔥🔥🔥🔥🔥 LOGIN FULLY ISOLATED: Exibindo toast de erro:', errorMessage);
      setError(errorMessage);
      ultraDelayedToast.error(errorMessage, 20000); // 20 segundos para garantir
      
    } finally {
      setIsLoading(false);
      console.log('🔥🔥🔥🔥🔥 LOGIN FULLY ISOLATED: Finally executado!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Login FULLY ISOLATED
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Teste completamente isolado do AuthContext
          </p>
        </div>

        {/* Botão de teste */}
        <button
          type="button"
          onClick={testToast}
          className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          🟢 Teste de Toast (Fully Isolated)
        </button>

        {/* SEM tag <form> - apenas div */}
        <div className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Digite seu username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Digite sua senha"
              />
            </div>
          </div>

          <div>
            <button
              type="button"
              disabled={isLoading}
              onClick={doLoginDirect}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Carregando...' : '🔵 Login DIRETO (sem AuthContext)'}
            </button>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Use <strong>admin/admin123</strong> para sucesso</p>
          <p>Use <strong>test/wrong</strong> para erro</p>
          <Link to="/logout-test" className="text-blue-600 hover:text-blue-500">
            Voltar ao Logout Test
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginFullyIsolated;
