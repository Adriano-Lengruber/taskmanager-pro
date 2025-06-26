import React from 'react';
import { useGlobalToast } from '../utils/globalToast';

export const GlobalToastTestPage: React.FC = () => {
  const toast = useGlobalToast();

  const testAllToasts = () => {
    console.log('🧪 TESTANDO TOASTS GLOBAIS...');
    
    // Teste sequencial para verificar se há piscar (sem ícones nas mensagens pois são adicionados automaticamente)
    setTimeout(() => toast.success('Toast global de sucesso!'), 500);
    setTimeout(() => toast.error('Toast global de erro!'), 2000);
    setTimeout(() => toast.warning('Toast global de aviso!'), 4000);
    setTimeout(() => toast.info('Toast global de informação!'), 6000);
  };

  const testLoginError = () => {
    console.log('🧪 SIMULANDO ERRO DE LOGIN GLOBAL...');
    toast.error('Usuário ou senha incorretos. Verifique suas credenciais e tente novamente.', 10000);
  };

  const testMultipleErrors = () => {
    console.log('🧪 TESTANDO MÚLTIPLOS ERROS GLOBAIS...');
    
    toast.error('Primeiro erro global', 3000);
    
    setTimeout(() => {
      toast.error('Segundo erro global', 3000);
    }, 1000);
    
    setTimeout(() => {
      toast.error('Terceiro erro global', 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          🌍 Toast Global (DOM Direto)
        </h1>
        
        <div className="space-y-4">
          <button
            onClick={testAllToasts}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded transition-colors"
          >
            🚀 Testar Todos os Toasts Globais
          </button>

          <button
            onClick={testLoginError}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded transition-colors"
          >
            🔐 Simular Erro de Login Global
          </button>

          <button
            onClick={testMultipleErrors}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded transition-colors"
          >
            ⚡ Múltiplos Erros Rápidos Globais
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => toast.success('Sucesso global!')}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded text-sm"
            >
              ✅ Sucesso
            </button>

            <button
              onClick={() => toast.error('Erro global!')}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded text-sm"
            >
              ❌ Erro
            </button>

            <button
              onClick={() => toast.warning('Aviso global!')}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-3 rounded text-sm"
            >
              ⚠️ Aviso
            </button>

            <button
              onClick={() => toast.info('Info global!')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded text-sm"
            >
              ℹ️ Info
            </button>
          </div>

          <button
            onClick={() => toast.clear()}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded text-sm"
          >
            🧹 Limpar Toast
          </button>

          <div className="mt-6 p-4 bg-gray-50 rounded">
            <h3 className="font-semibold mb-2">🎯 Solução Radical:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <strong>DOM direto</strong> - sem React Context</li>
              <li>• <strong>Zero re-renders</strong> - não afeta componentes</li>
              <li>• <strong>Isolado</strong> - independente do estado da aplicação</li>
              <li>• <strong>Estável</strong> - sem conflitos de contexto</li>
            </ul>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
            <strong>💡 Teste:</strong> Este toast é renderizado diretamente no DOM usando JavaScript vanilla, completamente isolado do React.
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalToastTestPage;
