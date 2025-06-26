import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ultraDelayedToast } from '../utils/ultraDelayedToast';
import { authService } from '../services/auth';
import LoadingSpinner from '../components/LoadingSpinner';

const LoginDiagnostic: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log('🔍 DIAGNOSTIC:', logMessage);
    setLogs(prev => [...prev, logMessage]);
  };

  useEffect(() => {
    addLog('Página LoginDiagnostic carregada');
    
    // Verificar se há token no localStorage
    const token = localStorage.getItem('auth_token');
    if (token) {
      addLog('Token encontrado no localStorage: ' + token.substring(0, 20) + '...');
    } else {
      addLog('Nenhum token encontrado no localStorage');
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const testErrorToast = () => {
    addLog('Testando toast de erro direto...');
    ultraDelayedToast.error('Teste de toast de erro', 10000);
  };

  const testSuccessToast = () => {
    addLog('Testando toast de sucesso direto...');
    ultraDelayedToast.success('Teste de toast de sucesso', 5000);
  };

  const handleLogin = async () => {
    addLog(`Iniciando login com usuário: ${formData.username}`);
    setIsLoading(true);

    try {
      // Login direto sem usar AuthContext
      addLog('Fazendo requisição de login direto...');
      const token = await authService.login(formData);
      
      addLog('Login bem-sucedido, token recebido');
      authService.setToken(token.access_token);
      
      addLog('Token salvo no localStorage');
      
      // Buscar dados do usuário
      const userData = await authService.getCurrentUser();
      addLog('Dados do usuário obtidos: ' + JSON.stringify(userData));
      
      authService.setStoredUser(userData);
      addLog('Dados do usuário salvos no localStorage');
      
      // Exibir toast de sucesso
      ultraDelayedToast.success('Login realizado com sucesso!', 5000);
      addLog('Toast de sucesso exibido');
      
      // Aguardar um pouco antes de redirecionar
      setTimeout(() => {
        addLog('Redirecionando para dashboard...');
        navigate('/dashboard');
      }, 2000);
      
    } catch (error: any) {
      addLog('Erro no login: ' + JSON.stringify(error.response?.data || error.message));
      
      let errorMessage = 'Erro desconhecido';
      if (error.response?.status === 401) {
        errorMessage = 'Credenciais inválidas';
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      addLog('Exibindo toast de erro: ' + errorMessage);
      ultraDelayedToast.error(errorMessage, 15000);
      
    } finally {
      setIsLoading(false);
      addLog('Loading finalizado');
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const clearTokens = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    addLog('Tokens removidos do localStorage');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Diagnóstico de Login - Teste Isolado
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Formulário */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Login</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Usuário
                  </label>
                  <input
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Digite o usuário"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Senha
                  </label>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Digite a senha"
                  />
                </div>

                <button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? <LoadingSpinner size="sm" /> : 'Fazer Login'}
                </button>
              </div>

              <div className="mt-6 space-y-2">
                <button
                  onClick={testSuccessToast}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                >
                  Testar Toast Sucesso
                </button>
                
                <button
                  onClick={testErrorToast}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                >
                  Testar Toast Erro
                </button>
                
                <button
                  onClick={clearTokens}
                  className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700"
                >
                  Limpar Tokens
                </button>
              </div>

              <div className="mt-4 text-center">
                <Link to="/login" className="text-blue-600 hover:text-blue-500">
                  ← Voltar para Login Principal
                </Link>
              </div>
            </div>

            {/* Logs */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Logs</h2>
                <button
                  onClick={clearLogs}
                  className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                >
                  Limpar
                </button>
              </div>
              
              <div className="bg-gray-100 rounded-md p-4 h-96 overflow-y-auto">
                {logs.length === 0 ? (
                  <p className="text-gray-500 text-sm">Nenhum log ainda...</p>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="text-xs font-mono text-gray-700 mb-1">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginDiagnostic;
