import React from 'react';
import { simpleToast } from '../utils/simpleToast';

export const SimpleToastTestPage: React.FC = () => {

  const testLoginError = () => {
    console.log('🧪 TESTANDO TOAST ULTRA SIMPLES - ERRO DE LOGIN...');
    simpleToast.error('Usuário ou senha incorretos. Verifique suas credenciais e tente novamente.', 10000);
  };

  const testSuccess = () => {
    console.log('🧪 TESTANDO TOAST ULTRA SIMPLES - SUCESSO...');
    simpleToast.success('Login realizado com sucesso!');
  };

  const testMultiple = () => {
    console.log('🧪 TESTANDO MÚLTIPLOS TOASTS ULTRA SIMPLES...');
    
    simpleToast.error('Primeiro erro', 3000);
    
    setTimeout(() => {
      simpleToast.error('Segundo erro', 3000);
    }, 1000);
    
    setTimeout(() => {
      simpleToast.success('Sucesso final', 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          🏗️ Toast Ultra Simples
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

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => simpleToast.success('Sucesso!')}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded text-sm"
            >
              ✅ Sucesso
            </button>

            <button
              onClick={() => simpleToast.error('Erro!')}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded text-sm"
            >
              ❌ Erro
            </button>

            <button
              onClick={() => simpleToast.warning('Aviso!')}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-3 rounded text-sm"
            >
              ⚠️ Aviso
            </button>

            <button
              onClick={() => simpleToast.info('Info!')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded text-sm"
            >
              ℹ️ Info
            </button>
          </div>

          <button
            onClick={() => simpleToast.clear()}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded text-sm"
          >
            🧹 Limpar Toast
          </button>

          <div className="mt-6 p-4 bg-gray-50 rounded">
            <h3 className="font-semibold mb-2">🎯 Toast ULTRA Simples:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <strong>Zero animações</strong> - aparece e some instantaneamente</li>
              <li>• <strong>Container próprio</strong> - isolado do React</li>
              <li>• <strong>Class-based</strong> - estado interno robusto</li>
              <li>• <strong>Logs detalhados</strong> - debug fácil</li>
            </ul>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
            <strong>🔬 Objetivo:</strong> Se este toast não piscar, saberemos que a solução funciona e podemos aplicar no login.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleToastTestPage;
