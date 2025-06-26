import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ultraStableToast } from '../utils/ultraStableToast';
import { ultraDelayedToast } from '../utils/ultraDelayedToast';
import type { UserLogin } from '../types/api';

const UltraStableToastTest: React.FC = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState<UserLogin>({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

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

    console.log('🔥 UltraStableToastTest: Form submitted', formData.username);

    try {
      console.log('🔥 UltraStableToastTest: Calling login function...');
      await login(formData);
      console.log('🔥 UltraStableToastTest: Success! Showing success toast...');
      ultraStableToast.success('Login realizado com sucesso! Esta é uma mensagem de sucesso que deve aparecer estável.', 8000);
    } catch (err: any) {
      console.error('🔥 UltraStableToastTest: Error occurred:', err);
      
      let errorMessage = 'Erro de login. Verifique suas credenciais.';
      
      if (err.response?.status === 401) {
        errorMessage = 'Usuário ou senha incorretos. Esta é uma mensagem de erro que deve permanecer visível e estável durante 10 segundos.';
      } else if (err.response?.data?.detail) {
        errorMessage = typeof err.response.data.detail === 'string' 
          ? err.response.data.detail 
          : 'Dados de login inválidos. Verifique se todos os campos estão preenchidos corretamente.';
      }
      
      console.log('🔥 UltraStableToastTest: Showing error toast...');
      console.log('🔥🔥🔥 TESTE: Chamando ultraDelayedToast.error...', errorMessage);
      ultraDelayedToast.error(errorMessage, 10000); // Usa delay de 2s automaticamente
      console.log('🔥🔥🔥 TESTE: ultraDelayedToast.error chamado!');
    } finally {
      setIsLoading(false);
    }
  };

  const testToasts = () => {
    console.log('🔥 UltraStableToastTest: Testing all toast types...');
    ultraStableToast.success('Toast de sucesso - deve aparecer estável por 4 segundos');
    
    setTimeout(() => {
      ultraStableToast.error('Toast de erro - deve aparecer estável por 8 segundos');
    }, 1000);
    
    setTimeout(() => {
      ultraStableToast.warning('Toast de aviso - deve aparecer estável por 4 segundos');
    }, 2000);
    
    setTimeout(() => {
      ultraStableToast.info('Toast de informação - deve aparecer estável por 4 segundos');
    }, 3000);
  };

  const testDelayedToasts = () => {
    console.log('🔥 UltraDelayedToast: Testing delayed toasts (for AuthContext scenarios)...');
    ultraDelayedToast.success('Toast DELAYED de sucesso - deve aparecer após 1.5s de delay');
    
    setTimeout(() => {
      ultraDelayedToast.error('Toast DELAYED de erro - deve aparecer após 2s de delay');
    }, 500);
    
    setTimeout(() => {
      ultraDelayedToast.warning('Toast DELAYED de aviso - deve aparecer após 1.5s de delay');
    }, 1000);
    
    setTimeout(() => {
      ultraDelayedToast.info('Toast DELAYED de informação - deve aparecer após 1.5s de delay');
    }, 1500);
  };

  const clearAllToasts = () => {
    console.log('🔥 UltraStableToastTest: Clearing all toasts...');
    ultraStableToast.clear();
    ultraDelayedToast.clear();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold text-gray-900 mb-2">
            Ultra Stable Toast Test
          </h1>
          <p className="text-center text-sm text-gray-600 mb-6">
            Teste do toast ultra estável - completamente isolado do React
          </p>
        </div>

        {/* Botões de teste */}
        <div className="space-y-4">
          <button
            onClick={testToasts}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Testar Todos os Tipos de Toast (Imediato)
          </button>
          
          <button
            onClick={testDelayedToasts}
            className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
          >
            Testar Toast com Delay (Para AuthContext)
          </button>
          
          <button
            onClick={clearAllToasts}
            className="w-full py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
          >
            Limpar Todos os Toasts
          </button>
        </div>

        {/* Formulário de login para teste real */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <h2 className="text-center text-xl font-semibold text-gray-800">
            Teste de Login Real
          </h2>
          
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {isLoading ? 'Testando Login...' : 'Testar Login com Ultra Stable Toast'}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500">
          <p>Use credenciais inválidas para testar o toast de erro</p>
          <p>Use admin/admin123 para testar o toast de sucesso</p>
        </div>
      </div>
    </div>
  );
};

export default UltraStableToastTest;
