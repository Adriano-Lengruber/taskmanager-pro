import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthSimple } from '../contexts/AuthContextSimple';
import { useToast } from '../contexts/ToastContext';

export const DashboardSimple: React.FC = () => {
  const { user, logout } = useAuthSimple();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogout = () => {
    console.log('DashboardSimple: Logout button clicked');
    logout();
    console.log('DashboardSimple: Logout completed, redirecting to login');
    showToast('Logged out successfully', 'success');
    navigate('/login', { replace: true });
  };

  const handleGoTest = () => {
    navigate('/test');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header with Logout */}
        <div className="bg-white shadow rounded-lg p-4 flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome, {user?.full_name || user?.username}!</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleGoTest}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Go to Test Page
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Welcome Card */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.full_name || user?.username}!
          </h2>
          <p className="text-gray-600 mb-4">
            You have successfully accessed the dashboard. This confirms that authentication is working correctly.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700">User Info</h3>
              <p className="text-sm text-gray-600">Username: {user?.username}</p>
              <p className="text-sm text-gray-600">Email: {user?.email}</p>
              <p className="text-sm text-gray-600">Role: {user?.role}</p>
              <p className="text-sm text-gray-600">Active: {user?.is_active ? 'Yes' : 'No'}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700">System Status</h3>
              <p className="text-sm text-gray-600">✅ Authentication: Working</p>
              <p className="text-sm text-gray-600">✅ Dashboard Access: Working</p>
              <p className="text-sm text-gray-600">✅ User Data: Retrieved</p>
              <p className="text-sm text-gray-600">✅ Protected Route: Working</p>
            </div>
          </div>
        </div>

        {/* Test Navigation */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Navigation</h3>
          <p className="text-gray-600 mb-4">
            Test the navigation system and route protection:
          </p>
          
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => {
                console.log('=== TESTE DE PROTEÇÃO DE ROTA ===');
                console.log('1. Dashboard: Tentando navegar para /login');
                console.log('2. Dashboard: URL atual:', window.location.pathname);
                showToast('Trying to access login page...', 'info');
                
                // Usar setTimeout para capturar a mudança
                setTimeout(() => {
                  console.log('3. Dashboard: URL após navigate:', window.location.pathname);
                }, 100);
                
                navigate('/login');
                
                setTimeout(() => {
                  console.log('4. Dashboard: URL final:', window.location.pathname);
                  if (window.location.pathname === '/dashboard') {
                    console.log('✅ SUCESSO: Redirecionamento funcionou! Usuário permaneceu no dashboard');
                  }
                }, 200);
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Try to Go to Login (Should Redirect Back)
            </button>
            <button
              onClick={() => {
                console.log('DashboardSimple: Reloading page to test persistence');
                showToast('Reloading page to test authentication persistence...', 'info');
                window.location.reload();
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Reload Page (Test Persistence)
            </button>
            <button
              onClick={() => {
                console.log('DashboardSimple: Opening new tab to test route protection');
                showToast('Opening login in new tab...', 'info');
                window.open('/login', '_blank');
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Open Login in New Tab
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
