import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ultraDelayedToast } from '../utils/ultraDelayedToast';
import { authService } from '../services/auth';

const AutoTestPage: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const resultMessage = `[${timestamp}] ${message}`;
    console.log('🔬 AUTO-TEST:', resultMessage);
    setTestResults(prev => [...prev, resultMessage]);
  };

  const runAutomaticTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    addResult('🚀 Iniciando testes automáticos...');
    
    // Teste 1: Toast de sucesso
    addResult('🧪 Teste 1: Toast de sucesso');
    ultraDelayedToast.success('Teste automático de sucesso', 5000);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Teste 2: Toast de erro
    addResult('🧪 Teste 2: Toast de erro');
    ultraDelayedToast.error('Teste automático de erro', 10000);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Teste 3: Limpar tokens
    addResult('🧪 Teste 3: Limpando tokens existentes');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    
    // Teste 4: Login inválido
    addResult('🧪 Teste 4: Tentativa de login inválido');
    try {
      await authService.login({ username: 'usuario_inexistente', password: 'senha_errada' });
      addResult('❌ ERRO: Login inválido deveria ter falhado!');
    } catch (error: any) {
      addResult('✅ Login inválido falhou como esperado');
      addResult(`📄 Detalhes do erro: ${error.response?.status} - ${error.response?.data?.detail || error.message}`);
      
      // Exibir toast de erro
      setTimeout(() => {
        addResult('📱 Exibindo toast de erro para login inválido...');
        ultraDelayedToast.error('Login inválido - Teste automático', 10000);
      }, 500);
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Teste 5: Login válido
    addResult('🧪 Teste 5: Tentativa de login válido');
    try {
      const token = await authService.login({ username: 'admin@taskmanager.com', password: 'admin123' });
      addResult('✅ Login válido realizado com sucesso');
      addResult(`🎫 Token recebido: ${token.access_token.substring(0, 30)}...`);
      
      authService.setToken(token.access_token);
      
      const userData = await authService.getCurrentUser();
      addResult(`👤 Dados do usuário: ${userData.username} (${userData.email})`);
      
      authService.setStoredUser(userData);
      
      // Exibir toast de sucesso
      setTimeout(() => {
        addResult('📱 Exibindo toast de sucesso para login válido...');
        ultraDelayedToast.success('Login válido - Teste automático', 5000);
      }, 500);
      
    } catch (error: any) {
      addResult('❌ ERRO: Login válido falhou!');
      addResult(`📄 Detalhes do erro: ${error.response?.status} - ${error.response?.data?.detail || error.message}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addResult('🏁 Testes automáticos concluídos!');
    addResult('👀 Observe os toasts que devem aparecer no canto superior direito');
    setIsRunning(false);
  };

  useEffect(() => {
    // Rodar testes automaticamente quando a página carrega
    setTimeout(() => {
      runAutomaticTests();
    }, 1000);
  }, []);

  const clearResults = () => {
    setTestResults([]);
  };

  const manualTestSuccess = () => {
    addResult('🖱️ Teste manual: Toast de sucesso');
    ultraDelayedToast.success('Toast de sucesso manual', 5000);
  };

  const manualTestError = () => {
    addResult('🖱️ Teste manual: Toast de erro');
    ultraDelayedToast.error('Toast de erro manual', 10000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Teste Automático - Toast e Login
          </h1>
          
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">Status</h2>
            <p className="text-blue-700">
              {isRunning ? 'Executando testes automáticos...' : 'Testes concluídos ou aguardando'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Controles */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Controles</h2>
              
              <div className="space-y-2">
                <button
                  onClick={runAutomaticTests}
                  disabled={isRunning}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isRunning ? 'Executando...' : 'Executar Testes Automáticos'}
                </button>
                
                <button
                  onClick={manualTestSuccess}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                >
                  Teste Manual: Toast Sucesso
                </button>
                
                <button
                  onClick={manualTestError}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                >
                  Teste Manual: Toast Erro
                </button>
                
                <button
                  onClick={clearResults}
                  className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                >
                  Limpar Resultados
                </button>
              </div>

              <div className="mt-6 text-center">
                <Link to="/login" className="text-blue-600 hover:text-blue-500">
                  ← Voltar para Login Principal
                </Link>
              </div>
            </div>

            {/* Resultados */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Resultados ({testResults.length})
              </h2>
              
              <div className="bg-gray-100 rounded-md p-4 h-96 overflow-y-auto">
                {testResults.length === 0 ? (
                  <p className="text-gray-500 text-sm">Nenhum resultado ainda...</p>
                ) : (
                  testResults.map((result, index) => (
                    <div key={index} className="text-xs font-mono text-gray-700 mb-1 break-words">
                      {result}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-md font-semibold text-yellow-800 mb-2">
              O que observar:
            </h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Os toasts devem aparecer no canto superior direito da tela</li>
              <li>• Toast de erro (vermelho) deve durar 10 segundos</li>
              <li>• Toast de sucesso (verde) deve durar 5 segundos</li>
              <li>• Os toasts não devem piscar ou desaparecer rapidamente</li>
              <li>• O login inválido deve mostrar toast de erro</li>
              <li>• O login válido deve mostrar toast de sucesso</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoTestPage;
