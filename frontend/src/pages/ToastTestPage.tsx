import React from 'react';
import { useToast } from '../contexts/SuperStableToastContext';

export const ToastTestPage: React.FC = () => {
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  const testToasts = () => {
    console.log('🧪 TESTING TOASTS...');
    
    // Teste de toast de sucesso
    setTimeout(() => {
      showSuccess('✅ Toast de sucesso funcionando!');
    }, 500);

    // Teste de toast de erro  
    setTimeout(() => {
      showError('❌ Toast de erro funcionando!');
    }, 2000);

    // Teste de toast de aviso
    setTimeout(() => {
      showWarning('⚠️ Toast de aviso funcionando!');
    }, 4000);

    // Teste de toast de informação
    setTimeout(() => {
      showInfo('ℹ️ Toast de informação funcionando!');
    }, 6000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          🧪 Teste do Sistema de Toast
        </h1>
        
        <div className="space-y-4">
          <button
            onClick={testToasts}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded transition-colors"
          >
            🚀 Testar Todos os Toasts
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => showSuccess('Sucesso!')}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded text-sm"
            >
              ✅ Sucesso
            </button>

            <button
              onClick={() => showError('Erro!')}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded text-sm"
            >
              ❌ Erro
            </button>

            <button
              onClick={() => showWarning('Aviso!')}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-3 rounded text-sm"
            >
              ⚠️ Aviso
            </button>

            <button
              onClick={() => showInfo('Info!')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded text-sm"
            >
              ℹ️ Info
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded">
            <h3 className="font-semibold mb-2">📋 Instruções:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Clique nos botões para testar cada tipo de toast</li>
              <li>• Observe se os toasts aparecem e somem suavemente</li>
              <li>• Verifique se não há piscadas ou sumiços rápidos</li>
              <li>• Cada toast deve durar 5-8 segundos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToastTestPage;
