import React, { useState } from 'react';
import { simpleToast } from '../utils/simpleToast';

export const LoginPageDebugger: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Simular exatamente o que acontece no login
  const simulateLoginFlow = async () => {
    console.log('🔬 SIMULANDO FLUXO EXATO DO LOGIN...');
    
    setIsLoading(true);
    setError('');
    
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Simular erro de login
      throw new Error('Simulated login error');
    } catch (err: any) {
      console.error('Login: Error occurred:', err);
      
      // Replicar EXATAMENTE a lógica de erro do Login.tsx
      let errorMessage = 'Erro de conexão. Verifique sua conexão com a internet.';
      
      try {
        if (err.response?.status === 401) {
          errorMessage = 'Usuário ou senha incorretos. Verifique suas credenciais e tente novamente.';
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
          errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet ou tente novamente mais tarde.';
        } else if (err.code === 'ECONNREFUSED') {
          errorMessage = 'Servidor temporariamente indisponível. Tente novamente em alguns instantes.';
        }
      } catch (parseError) {
        console.error('Login: Error parsing error message:', parseError);
        errorMessage = 'Erro inesperado. Tente novamente ou entre em contato com o suporte.';
      }
      
      setError(errorMessage);
      // Toast de erro com duração maior para login
      console.log('🔥 Chamando simpleToast.error...');
      simpleToast.error(errorMessage, 10000); // 10 segundos para erros de login
    } finally {
      setIsLoading(false);
    }
  };

  const testDirectToast = () => {
    console.log('🔥 TESTE DIRETO DO TOAST...');
    simpleToast.error('Usuário ou senha incorretos. Verifique suas credenciais e tente novamente.', 10000);
  };

  const testWithStateChanges = () => {
    console.log('🔥 TESTE COM MUDANÇAS DE ESTADO...');
    
    // Simular mudanças de estado que podem causar re-render
    setIsLoading(true);
    setError('Algum erro temporário');
    
    // Toast durante mudanças de estado
    simpleToast.error('Toast durante mudanças de estado', 8000);
    
    setTimeout(() => {
      setError('');
      setIsLoading(false);
      simpleToast.success('Estado normalizado', 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            🔬 Login Page Debugger
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Replicando exatamente o ambiente do login
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={simulateLoginFlow}
            disabled={isLoading}
            className={`w-full font-bold py-3 px-4 rounded transition-colors ${
              isLoading 
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {isLoading ? '⏳ Processando Login...' : '🔐 Simular Fluxo Completo de Login'}
          </button>

          <button
            onClick={testDirectToast}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded transition-colors"
          >
            🎯 Toast Direto (sem estado)
          </button>

          <button
            onClick={testWithStateChanges}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded transition-colors"
          >
            🔄 Toast com Mudanças de Estado
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-red-400">❌</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded">
            <h3 className="font-semibold mb-2">🎯 Debug Status:</h3>
            <div className="text-sm space-y-1">
              <div>Loading: <span className={isLoading ? 'text-green-600' : 'text-gray-600'}>{isLoading ? 'TRUE' : 'FALSE'}</span></div>
              <div>Error: <span className={error ? 'text-red-600' : 'text-gray-600'}>{error || 'NULL'}</span></div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 rounded text-sm">
            <strong>🔬 Hipótese:</strong> Se o toast piscar aqui também, o problema é do toast. Se não piscar, o problema é algo específico da página de login real.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPageDebugger;
