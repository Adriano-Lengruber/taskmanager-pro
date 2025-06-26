import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ultraDelayedToast } from '../utils/ultraDelayedToast';

const LogoutTest: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    console.log('🔥 LogoutTest: Fazendo logout...');
    logout();
    ultraDelayedToast.success('Logout realizado com sucesso!');
  };

  const clearStorage = () => {
    console.log('🔥 LogoutTest: Limpando localStorage...');
    localStorage.clear();
    sessionStorage.clear();
    ultraDelayedToast.info('Storage limpo!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Logout & Debug
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Teste de autenticação
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p><strong>Autenticado:</strong> {isAuthenticated ? 'SIM' : 'NÃO'}</p>
            <p><strong>Usuário:</strong> {user ? user.username : 'Nenhum'}</p>
            <p><strong>Token:</strong> {localStorage.getItem('access_token') ? 'Existe' : 'Não existe'}</p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Fazer Logout
          </button>

          <button
            onClick={clearStorage}
            className="w-full py-3 px-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Limpar Storage
          </button>

          <Link
            to="/login-debug-simple"
            className="block w-full text-center py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Login Debug (React Router)
          </Link>

          <Link
            to="/login-no-form"
            className="block w-full text-center py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Login SEM Form (Teste Final)
          </Link>

          <Link
            to="/login-isolated"
            className="block w-full text-center py-3 px-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Login ISOLADO (sem AuthContext)
          </Link>

          <Link
            to="/login-test-simple"
            className="block w-full text-center py-3 px-4 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
          >
            Login ULTRA SIMPLE (sem form)
          </Link>

          <Link
            to="/login-fully-isolated"
            className="block w-full text-center py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Login FULLY ISOLATED (sem useAuth)
          </Link>

          <Link
            to="/login"
            className="block w-full text-center py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Login Normal (React Router)
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LogoutTest;
