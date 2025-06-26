import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ultraDelayedToast } from '../utils/ultraDelayedToast';
import { useNavigate } from 'react-router-dom';

const AuthContextTest: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading, user } = useAuth();
  const [formData, setFormData] = useState({
    username: 'admin@taskmanager.com',
    password: 'admin123'
  });
  const [rerenderCount, setRerenderCount] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log('🧪 AUTH-TEST:', logMessage);
    setLogs(prev => [...prev, logMessage]);
  };

  // Contar re-renders
  useEffect(() => {
    setRerenderCount(prev => prev + 1);
    addLog(`Re-render #${rerenderCount + 1} - isAuth: ${isAuthenticated}, isLoading: ${isLoading}, user: ${user?.username || 'null'}`);
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const testToastBeforeLogin = () => {
    addLog('🧪 Testando toast ANTES do login');
    ultraDelayedToast.success('Toast antes do login', 5000);
  };

  const testToastAfterLoginError = async () => {
    addLog('🧪 Iniciando teste: login inválido com toast');
    
    try {
      // Toast ANTES da tentativa de login
      ultraDelayedToast.info('Iniciando login inválido...', 3000);
      
      await login({ username: 'usuario_inexistente', password: 'senha_errada' });
      addLog('❌ ERRO: Login inválido deveria ter falhado');
    } catch (error: any) {
      addLog('✅ Login inválido falhou como esperado');
      
      // Toast IMEDIATAMENTE após o erro
      addLog('📱 Exibindo toast de erro...');
      ultraDelayedToast.error('Credenciais inválidas!', 15000, 0); // Sem delay
      
      // Toast com delay
      setTimeout(() => {
        addLog('📱 Exibindo toast de erro com delay...');
        ultraDelayedToast.error('Erro com delay de 1 segundo', 15000, 1000);
      }, 100);
    }
  };

  const testToastAfterLoginSuccess = async () => {
    addLog('🧪 Iniciando teste: login válido com toast');
    
    try {
      // Toast ANTES da tentativa de login
      ultraDelayedToast.info('Iniciando login válido...', 3000);
      
      await login(formData);
      addLog('✅ Login válido realizado com sucesso');
      
      // Toast IMEDIATAMENTE após o sucesso
      addLog('📱 Exibindo toast de sucesso...');
      ultraDelayedToast.success('Login realizado com sucesso!', 5000, 0); // Sem delay
      
      // Toast com delay
      setTimeout(() => {
        addLog('📱 Exibindo toast de sucesso com delay...');
        ultraDelayedToast.success('Sucesso com delay de 1 segundo', 5000, 1000);
      }, 100);
      
    } catch (error: any) {
      addLog('❌ ERRO: Login válido falhou');
      addLog(`Erro: ${error.message}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
    setRerenderCount(0);
  };

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Teste AuthContext vs Toast
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Status AuthContext */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">Status AuthContext</h2>
              <div className="space-y-2 text-sm">
                <p><strong>isAuthenticated:</strong> {String(isAuthenticated)}</p>
                <p><strong>isLoading:</strong> {String(isLoading)}</p>
                <p><strong>user:</strong> {user?.username || 'null'}</p>
                <p><strong>Re-renders:</strong> {rerenderCount}</p>
              </div>
            </div>

            {/* Controles */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Testes</h2>
              
              <div className="space-y-2">
                <button
                  onClick={testToastBeforeLogin}
                  className="w-full bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700"
                >
                  Toast Antes Login
                </button>
                
                <button
                  onClick={testToastAfterLoginError}
                  className="w-full bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700"
                >
                  Login Inválido + Toast
                </button>
                
                <button
                  onClick={testToastAfterLoginSuccess}
                  className="w-full bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700"
                >
                  Login Válido + Toast
                </button>
                
                <button
                  onClick={clearLogs}
                  className="w-full bg-gray-500 text-white py-2 px-3 rounded text-sm hover:bg-gray-600"
                >
                  Limpar Logs
                </button>
                
                <button
                  onClick={goToLogin}
                  className="w-full bg-purple-600 text-white py-2 px-3 rounded text-sm hover:bg-purple-700"
                >
                  Ir para Login Principal
                </button>
              </div>

              <div className="mt-4">
                <h3 className="font-medium text-gray-700 mb-2">Credenciais de Teste:</h3>
                <div className="space-y-2">
                  <input
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-2 py-1 border rounded text-sm"
                    placeholder="Usuário"
                  />
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-2 py-1 border rounded text-sm"
                    placeholder="Senha"
                  />
                </div>
              </div>
            </div>

            {/* Logs */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Logs ({logs.length})
              </h2>
              
              <div className="bg-gray-100 rounded-md p-3 h-80 overflow-y-auto">
                {logs.length === 0 ? (
                  <p className="text-gray-500 text-sm">Nenhum log ainda...</p>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="text-xs font-mono text-gray-700 mb-1 break-words">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">Hipóteses a verificar:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• AuthContext causa re-renders que interrompem toasts</li>
              <li>• Mudança de estado isLoading afeta DOM onde estão os toasts</li>
              <li>• PublicRoute/ProtectedRoute redirecionam e destroem toasts</li>
              <li>• Timing do toast vs. timing do AuthContext</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthContextTest;
