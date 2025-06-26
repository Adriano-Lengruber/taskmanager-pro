import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ultraDelayedToast } from '../utils/ultraDelayedToast';
import apiClient from '../lib/api';

const LoginTestIsolated: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log('🔥 LoginTestIsolated: Campo alterado:', name, '=', value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoginDirect = async (e?: React.MouseEvent) => {
    console.log('🔥🔥🔥🔥🔥 LOGIN TEST ISOLATED: handleLoginDirect EXECUTADO!');
    console.log('🔥🔥🔥🔥🔥 LOGIN TEST ISOLATED: Event:', e);
    
    // Prevenir qualquer comportamento padrão
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('🔥🔥🔥🔥🔥 LOGIN TEST ISOLATED: Event prevented and stopped!');
    }
    
    console.log('🔥🔥🔥🔥🔥 LOGIN TEST ISOLATED: Dados do formulário:', formData);
    
    setIsLoading(true);
    setError('');

    try {
      console.log('🔥🔥🔥🔥🔥 LOGIN TEST ISOLATED: Fazendo requisição direta ao backend...');
      
      // Fazer requisição direta sem AuthContext
      const requestData = new URLSearchParams();
      requestData.append('username', formData.username);
      requestData.append('password', formData.password);
      
      console.log('🔥🔥🔥🔥🔥 LOGIN TEST ISOLATED: Form data criado:', requestData.toString());
      
      const response = await apiClient.post('/api/v1/auth/login', requestData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      console.log('✅ LOGIN TEST ISOLATED: Sucesso! Response:', response.data);
      ultraDelayedToast.success('Login realizado com sucesso! (Teste Isolado)');
      
    } catch (err: any) {
      console.error('🔥🔥🔥🔥🔥 LOGIN TEST ISOLATED: Erro capturado:', err);
      console.error('🔥🔥🔥🔥🔥 LOGIN TEST ISOLATED: Error response:', err.response);
      console.error('🔥🔥🔥🔥🔥 LOGIN TEST ISOLATED: Error status:', err.response?.status);
      console.error('🔥🔥🔥🔥🔥 LOGIN TEST ISOLATED: Error data:', err.response?.data);
      
      let errorMessage = 'Erro ao fazer login';
      if (err.response?.status === 401) {
        errorMessage = 'Credenciais inválidas. Tente novamente.';
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      }
      
      setError(errorMessage);
      console.log('🔥🔥🔥🔥🔥 LOGIN TEST ISOLATED: Chamando ultraDelayedToast.error:', errorMessage);
      ultraDelayedToast.error(errorMessage, 15000);
      console.log('🔥🔥🔥🔥🔥 LOGIN TEST ISOLATED: Toast de erro chamado!');
    } finally {
      setIsLoading(false);
      console.log('🔥🔥🔥🔥🔥 LOGIN TEST ISOLATED: Finally executado!');
    }
  };

  const testButtonClick = () => {
    console.log('🔥🔥🔥🔥🔥 LOGIN TEST ISOLATED: Botão de teste clicado!');
    ultraDelayedToast.info('Botão de teste funcionando! (Teste Isolado)');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Login Teste ISOLADO
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Teste completamente isolado do AuthContext
          </p>
        </div>

        {/* Botão de teste */}
        <button
          type="button"
          onClick={testButtonClick}
          className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Teste de Clique (deve aparecer toast)
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
              onClick={(e) => handleLoginDirect(e)}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Carregando...' : 'Login DIRETO (sem AuthContext)'}
            </button>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Use admin/admin123 para sucesso</p>
          <p>Use test/wrong para erro</p>
          <Link to="/logout-test" className="text-blue-600 hover:text-blue-500">
            Voltar ao Logout Test
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginTestIsolated;
