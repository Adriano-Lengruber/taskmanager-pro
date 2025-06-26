import React, { useState } from 'react';
import { useToast } from '../contexts/SuperStableToastContext';
import { useAuth } from '../contexts/AuthContext';

export const LoginToastDebugPage: React.FC = () => {
  const { showToast, showError } = useToast();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const simulateLoginError = async () => {
    console.log('🧪 SIMULANDO ERRO DE LOGIN...');
    setIsLoading(true);
    
    try {
      // Tentar login com credenciais inválidas (vai dar erro)
      await login({ username: 'invalid', password: 'invalid' });
    } catch (err: any) {
      console.error('Erro capturado:', err);
      
      // Replicar exatamente a lógica do Login.tsx
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
        console.error('Erro ao processar erro:', parseError);
        errorMessage = 'Erro inesperado. Tente novamente ou entre em contato com o suporte.';
      }
      
      console.log('Mostrando toast de erro:', errorMessage);
      // Toast de erro com duração maior para login (igual ao Login.tsx)
      showError(errorMessage, 10000);
    } finally {
      setIsLoading(false);
    }
  };

  const testDirectError = () => {
    console.log('🧪 TESTANDO TOAST DE ERRO DIRETO...');
    showError('Usuário ou senha incorretos. Verifique suas credenciais e tente novamente.', 10000);
  };

  const testMultipleToasts = () => {
    console.log('🧪 TESTANDO MÚLTIPLOS TOASTS...');
    
    // Simular erro de login rápido
    showError('Primeiro erro de login', 3000);
    
    setTimeout(() => {
      showError('Segundo erro de login', 3000);
    }, 1000);
    
    setTimeout(() => {
      showError('Terceiro erro de login', 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          🐛 Debug Toast no Login
        </h1>
        
        <div className="space-y-4">
          <button
            onClick={simulateLoginError}
            disabled={isLoading}
            className={`w-full font-bold py-3 px-4 rounded transition-colors ${
              isLoading 
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {isLoading ? '⏳ Processando...' : '🔐 Simular Erro de Login Real'}
          </button>

          <button
            onClick={testDirectError}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded transition-colors"
          >
            ⚡ Toast de Erro Direto
          </button>

          <button
            onClick={testMultipleToasts}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded transition-colors"
          >
            🔄 Múltiplos Toasts Rápidos
          </button>

          <div className="mt-6 p-4 bg-gray-50 rounded">
            <h3 className="font-semibold mb-2">🎯 Objetivo:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Replicar exatamente o contexto do login</li>
              <li>• Testar se o problema é específico do fluxo de erro</li>
              <li>• Verificar se múltiplos toasts causam piscar</li>
              <li>• Identificar quando exatamente o toast pisca</li>
            </ul>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
            <strong>💡 Dica:</strong> Abra o console do navegador (F12) para ver logs detalhados
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginToastDebugPage;
