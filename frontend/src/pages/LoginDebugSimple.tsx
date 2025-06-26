import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ultraDelayedToast } from '../utils/ultraDelayedToast';
import type { UserLogin } from '../types/api';

const LoginDebugSimple: React.FC = () => {
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
    console.log('🔥 LoginDebugSimple: Campo alterado:', name, '=', value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('🔥🔥🔥🔥🔥 LOGIN DEBUG: handleSubmit EXECUTADO!');
    console.log('🔥🔥🔥🔥🔥 LOGIN DEBUG: Evento recebido:', e);
    console.log('🔥🔥🔥🔥🔥 LOGIN DEBUG: Tipo do evento:', e.type);
    e.preventDefault();
    console.log('🔥🔥🔥🔥🔥 LOGIN DEBUG: preventDefault chamado');
    console.log('🔥🔥🔥🔥🔥 LOGIN DEBUG: Dados do formulário:', formData);
    
    setIsLoading(true);
    setError('');

    try {
      console.log('🔥🔥🔥🔥🔥 LOGIN DEBUG: Tentando fazer login...');
      await login(formData);
      console.log('🔥🔥🔥🔥🔥 LOGIN DEBUG: Login com sucesso!');
      ultraDelayedToast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('🔥🔥🔥🔥🔥 LOGIN DEBUG: Erro capturado:', err);
      console.error('🔥🔥🔥🔥🔥 LOGIN DEBUG: Error response:', err.response);
      console.error('🔥🔥🔥🔥🔥 LOGIN DEBUG: Error status:', err.response?.status);
      console.error('🔥🔥🔥🔥🔥 LOGIN DEBUG: Error data:', err.response?.data);
      
      // SOLUÇÃO: Usar setTimeout para garantir que o toast seja exibido 
      // APÓS qualquer re-render do AuthContext
      setTimeout(() => {
        let errorMessage = 'Usuário ou senha incorretos';
        if (err.response?.status === 401) {
          errorMessage = 'Credenciais inválidas. Tente novamente.';
        } else if (err.response?.data?.detail) {
          errorMessage = err.response.data.detail;
        }
        
        console.log('🔥🔥🔥🔥🔥 LOGIN DEBUG: Exibindo toast de erro:', errorMessage);
        setError(errorMessage);
        ultraDelayedToast.error(errorMessage, 15000);
      }, 100); // Delay para deixar o AuthContext se estabilizar
    } finally {
      // Usar setTimeout no finally para evitar problemas de timing
      setTimeout(() => {
        setIsLoading(false);
        console.log('🔥🔥🔥🔥🔥 LOGIN DEBUG: Loading definido como false');
      }, 50);
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    console.log('🔥🔥🔥🔥🔥 LOGIN DEBUG: Botão clicado!');
    console.log('🔥🔥🔥🔥🔥 LOGIN DEBUG: Evento do botão:', e);
    console.log('🔥🔥🔥🔥🔥 LOGIN DEBUG: Target:', e.target);
    // Não chamar preventDefault aqui - deixar o submit normal acontecer
  };

  const testButtonClick = () => {
    console.log('🔥🔥🔥🔥🔥 LOGIN DEBUG: Botão de teste clicado!');
    ultraDelayedToast.info('Botão de teste funcionando!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Login Debug Simple
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Versão simplificada para debug
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

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
                required
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
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Digite sua senha"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              onClick={handleButtonClick}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Carregando...' : 'Fazer Login (Debug)'}
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-500">
          <p>Use admin/admin123 para sucesso</p>
          <p>Use test/wrong para erro</p>
          <Link to="/login" className="text-blue-600 hover:text-blue-500">
            Voltar ao Login Normal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginDebugSimple;
