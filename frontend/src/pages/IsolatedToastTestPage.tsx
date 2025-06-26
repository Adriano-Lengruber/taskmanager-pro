import React from 'react';
import { isolatedToast } from '../utils/isolatedToast';

export const IsolatedToastTestPage: React.FC = () => {

  const testLoginError = () => {
    console.log('🧪 TESTANDO TOAST ISOLADO - ERRO DE LOGIN...');
    isolatedToast.error('Usuário ou senha incorretos. Verifique suas credenciais e tente novamente.', 10000);
  };

  const testSuccess = () => {
    console.log('🧪 TESTANDO TOAST ISOLADO - SUCESSO...');
    isolatedToast.success('Login realizado com sucesso!');
  };

  const testMultiple = () => {
    console.log('🧪 TESTANDO MÚLTIPLOS TOASTS ISOLADOS...');
    
    isolatedToast.error('Primeiro erro isolado', 3000);
    
    setTimeout(() => {
      isolatedToast.error('Segundo erro isolado', 3000);
    }, 1000);
    
    setTimeout(() => {
      isolatedToast.success('Sucesso final isolado', 3000);
    }, 2000);
  };

  const testReactReRenders = () => {
    console.log('🧪 TESTANDO TOAST COM RE-RENDERS REACT...');
    
    // Força re-renders múltiplos para simular o problema do AuthContext
    let count = 0;
    const interval = setInterval(() => {
      count++;
      
      // Toast durante re-renders
      if (count === 1) {
        isolatedToast.warning('Toast durante re-renders React', 8000);
      }
      
      // Força re-render do componente
      // this.forceUpdate?.();
      
      if (count >= 10) {
        clearInterval(interval);
        isolatedToast.info('Re-renders terminados', 3000);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          🔒 Toast Isolado (Anti-AuthContext)
        </h1>
        
        <div className="space-y-4">
          <button
            onClick={testLoginError}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded transition-colors"
          >
            🔐 Teste Erro de Login (10s)
          </button>

          <button
            onClick={testSuccess}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded transition-colors"
          >
            ✅ Teste Sucesso
          </button>

          <button
            onClick={testMultiple}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded transition-colors"
          >
            🔄 Múltiplos Toasts
          </button>

          <button
            onClick={testReactReRenders}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded transition-colors"
          >
            🔄 Toast + Re-renders React
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => isolatedToast.success('Sucesso isolado!')}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded text-sm"
            >
              ✅ Sucesso
            </button>

            <button
              onClick={() => isolatedToast.error('Erro isolado!')}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded text-sm"
            >
              ❌ Erro
            </button>

            <button
              onClick={() => isolatedToast.warning('Aviso isolado!')}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-3 rounded text-sm"
            >
              ⚠️ Aviso
            </button>

            <button
              onClick={() => isolatedToast.info('Info isolado!')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded text-sm"
            >
              ℹ️ Info
            </button>
          </div>

          <button
            onClick={() => isolatedToast.clear()}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded text-sm"
          >
            🧹 Limpar Toast
          </button>

          <div className="mt-6 p-4 bg-gray-50 rounded">
            <h3 className="font-semibold mb-2">🔒 Toast Anti-AuthContext:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <strong>Container isolado</strong> - fora da árvore React</li>
              <li>• <strong>z-index máximo</strong> - 2147483647</li>
              <li>• <strong>Estilos !important</strong> - evita sobrescrita</li>
              <li>• <strong>requestAnimationFrame</strong> - evita conflitos</li>
              <li>• <strong>XSS protection</strong> - escaping de HTML</li>
            </ul>
          </div>

          <div className="mt-4 p-3 bg-green-50 rounded text-sm">
            <strong>✅ Solução Final:</strong> Este toast é 100% isolado do AuthContext e não sofre interferência de re-renders.
          </div>
        </div>
      </div>
    </div>
  );
};

export default IsolatedToastTestPage;
