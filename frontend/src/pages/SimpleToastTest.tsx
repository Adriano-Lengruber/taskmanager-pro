import React, { useEffect, useState } from 'react';
import { ultraDelayedToast } from '../utils/ultraDelayedToast';

const SimpleToastTest: React.FC = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('🔧 SimpleToastTest montado');
    
    // Teste imediato quando carrega
    setTimeout(() => {
      console.log('🧪 Executando teste de toast simples');
      ultraDelayedToast.success('Toast funcionando!', 5000);
      setCount(1);
    }, 1000);
  }, []);

  const testError = () => {
    console.log('🧪 Testando toast de erro');
    ultraDelayedToast.error('Erro de teste!', 10000);
    setCount(prev => prev + 1);
  };

  const testSuccess = () => {
    console.log('🧪 Testando toast de sucesso');
    ultraDelayedToast.success('Sucesso de teste!', 5000);
    setCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Teste Simples de Toast
        </h1>
        
        <div className="space-y-4">
          <p className="text-center text-gray-600">
            Toasts testados: {count}
          </p>
          
          <button
            onClick={testSuccess}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 font-medium"
          >
            Toast de Sucesso
          </button>
          
          <button
            onClick={testError}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 font-medium"
          >
            Toast de Erro
          </button>
          
          <div className="text-center mt-6">
            <a href="/login" className="text-blue-600 hover:text-blue-500">
              ← Voltar para Login
            </a>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded text-sm">
          <strong>Instruções:</strong>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Os toasts devem aparecer no canto superior direito</li>
            <li>Toast verde = sucesso (5 segundos)</li>
            <li>Toast vermelho = erro (10 segundos)</li>
            <li>Se não aparecer, há um problema</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SimpleToastTest;
