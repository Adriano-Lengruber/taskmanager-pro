import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ultraDelayedToast } from '../utils/ultraDelayedToast';
import type { UserLogin } from '../types/api';

const LoginNoForm: React.FC = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState<UserLogin>({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log('🔥 LoginNoForm: Campo alterado:', name, '=', value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e?: React.MouseEvent) => {
    console.log('🔥🔥🔥🔥🔥 LOGIN NO FORM: handleLogin EXECUTADO!');
    console.log('🔥🔥🔥🔥🔥 LOGIN NO FORM: Event:', e);
    
    // Prevenir qualquer comportamento padrão
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('🔥🔥🔥🔥🔥 LOGIN NO FORM: Event prevented and stopped!');
    }
    
    console.log('🔥🔥🔥🔥🔥 LOGIN NO FORM: Dados do formulário:', formData);
    
    setIsLoading(true);
    setError('');

    try {
      console.log('🔥🔥🔥🔥🔥 LOGIN NO FORM: Tentando fazer login...');
      await login(formData);
      console.log('🔥🔥🔥🔥🔥 LOGIN NO FORM: Login com sucesso!');
      ultraDelayedToast.success('Login realizado com sucesso!');
    } catch (err: any) {
      console.error('🔥🔥🔥🔥🔥 LOGIN NO FORM: Erro capturado:', err);
      
      let errorMessage = 'Usuário ou senha incorretos';
      if (err.response?.status === 401) {
        errorMessage = 'Credenciais inválidas. Tente novamente.';
      }
      
      setError(errorMessage);
      console.log('🔥🔥🔥🔥🔥 LOGIN NO FORM: Chamando ultraDelayedToast.error:', errorMessage);
      ultraDelayedToast.error(errorMessage, 10000);
      console.log('🔥🔥🔥🔥🔥 LOGIN NO FORM: Toast chamado!');
    } finally {
      setIsLoading(false);
    }
  };

  const testButtonClick = () => {
    console.log('🔥🔥🔥🔥🔥 LOGIN NO FORM: Botão de teste clicado!');
    ultraDelayedToast.info('Botão de teste funcionando sem formulário!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Login SEM Formulário HTML
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Teste sem tag &lt;form&gt;
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
              onClick={(e) => handleLogin(e)}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Carregando...' : 'Fazer Login (SEM FORM)'}
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

export default LoginNoForm;
