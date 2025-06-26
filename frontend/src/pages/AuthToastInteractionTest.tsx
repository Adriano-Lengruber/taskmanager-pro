import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../contexts/SuperStableToastContext';
import { useAuth } from '../contexts/AuthContext';

export const AuthToastInteractionTest: React.FC = () => {
  const { showError, showSuccess } = useToast();
  const { isLoading, isAuthenticated, user } = useAuth();
  const [renderCount, setRenderCount] = useState(0);
  const [authStates, setAuthStates] = useState<string[]>([]);
  const renderCountRef = useRef(0);

  // Contar re-renders
  useEffect(() => {
    renderCountRef.current += 1;
    setRenderCount(renderCountRef.current);
    
    const newState = `Render #${renderCountRef.current}: isLoading=${isLoading}, isAuth=${isAuthenticated}, user=${user?.username || 'null'}`;
    setAuthStates(prev => [...prev.slice(-4), newState]); // Manter últimos 5 estados
    
    console.log('🔄 AuthToastInteractionTest re-render:', newState);
  });

  // Simular exatamente o que acontece no login com erro
  const simulateLoginFlow = async () => {
    console.log('🧪 SIMULANDO FLUXO COMPLETO DE LOGIN COM ERRO...');
    
    // 1. Estado inicial - mostrar loading
    showSuccess('Iniciando login...', 2000);
    
    // 2. Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 3. Simular erro de autenticação (401)
    showError('Usuário ou senha incorretos. Verifique suas credenciais e tente novamente.', 10000);
    
    // 4. Simular mudanças de estado do AuthContext
    console.log('Auth context estado atual:', { isLoading, isAuthenticated, user });
  };

  const testToastDuringAuthChange = () => {
    console.log('🧪 TESTANDO TOAST DURANTE MUDANÇAS DE AUTH...');
    
    // Toast de erro antes de qualquer mudança
    showError('Toast antes da mudança de estado', 8000);
    
    // Simular múltiplas mudanças rápidas de estado (como no login)
    setTimeout(() => {
      showError('Toast durante mudança de estado', 8000);
    }, 500);
    
    setTimeout(() => {
      showError('Toast após mudança de estado', 8000);
    }, 1000);
  };

  const testQuickMultipleErrors = () => {
    console.log('🧪 TESTANDO MÚLTIPLOS ERROS RÁPIDOS...');
    
    // Simular o que pode acontecer se o usuário clica rapidamente no login
    showError('Erro 1: Dados inválidos', 3000);
    
    setTimeout(() => {
      showError('Erro 2: Servidor indisponível', 3000);
    }, 200);
    
    setTimeout(() => {
      showError('Erro 3: Timeout de conexão', 3000);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          🔬 Teste de Interação Auth ↔ Toast
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Painel de Testes */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">🧪 Testes</h2>
            
            <div className="space-y-3">
              <button
                onClick={simulateLoginFlow}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded transition-colors"
              >
                🔐 Simular Fluxo de Login com Erro
              </button>

              <button
                onClick={testToastDuringAuthChange}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded transition-colors"
              >
                🔄 Toast Durante Mudanças de Auth
              </button>

              <button
                onClick={testQuickMultipleErrors}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded transition-colors"
              >
                ⚡ Múltiplos Erros Rápidos
              </button>

              <button
                onClick={() => setAuthStates([])}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors text-sm"
              >
                🧹 Limpar Log
              </button>
            </div>
          </div>

          {/* Painel de Monitoramento */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">📊 Monitoramento</h2>
            
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded">
                <strong>🔄 Re-renders:</strong> {renderCount}
              </div>
              
              <div className="p-3 bg-green-50 rounded">
                <strong>🔐 Auth Estado:</strong>
                <div className="text-sm mt-1">
                  <div>Loading: {isLoading ? '✅' : '❌'}</div>
                  <div>Authenticated: {isAuthenticated ? '✅' : '❌'}</div>
                  <div>User: {user?.username || 'null'}</div>
                </div>
              </div>
              
              <div className="p-3 bg-yellow-50 rounded">
                <strong>📝 Histórico de Estados:</strong>
                <div className="text-xs mt-2 space-y-1 max-h-32 overflow-y-auto">
                  {authStates.map((state, index) => (
                    <div key={index} className="font-mono text-gray-600">
                      {state}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">🎯 Objetivo do Teste</h2>
          <div className="text-gray-700 space-y-2">
            <p>• <strong>Identificar se re-renders excessivos</strong> do AuthContext causam piscar do toast</p>
            <p>• <strong>Verificar timing</strong> entre mudanças de estado de auth e exibição do toast</p>
            <p>• <strong>Testar comportamento</strong> com múltiplos toasts em sequência rápida</p>
            <p>• <strong>Monitorar interações</strong> entre diferentes contextos React</p>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
            <strong>💡 Dica:</strong> Abra o console (F12) para logs detalhados. Observe se o número de re-renders aumenta drasticamente ao mostrar toasts.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthToastInteractionTest;
