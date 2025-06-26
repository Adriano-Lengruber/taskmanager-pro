import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthSimple } from '../contexts/AuthContextSimple';
import { useToast } from '../contexts/SuperStableToastContext';

export const LoginTest: React.FC = () => {
  const { login, logout, user, isAuthenticated, isLoading } = useAuthSimple();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: 'testuser', password: 'testpass123' });
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState<'login' | 'dashboard'>('login');

  const handleLogin = async () => {
    setLoading(true);
    try {
      console.log('LoginTest: Attempting login...');
      await login(formData);
      showToast('Login successful! Redirecting to dashboard...', 'success');
      
      // Redirecionar para dashboard após login bem-sucedido
      setTimeout(() => {
        setCurrentView('dashboard');
      }, 1000);
    } catch (error: any) {
      console.error('LoginTest: Login failed:', error);
      showToast('Login failed: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentView('login');
    showToast('Logged out successfully', 'success');
  };

  const handleGoDashboard = () => {
    if (isAuthenticated) {
      setCurrentView('dashboard');
    } else {
      showToast('Please login first!', 'error');
    }
  };

  const handleGoLogin = () => {
    setCurrentView('login');
  };

  const handleGoRealLogin = () => {
    navigate('/login');
  };

  const handleGoRealDashboard = () => {
    navigate('/dashboard');
  };

  const handleStorageTest = () => {
    localStorage.setItem('auth_token', 'test-token');
    showToast('Test token stored', 'info');
  };

  const handleClearStorage = () => {
    localStorage.clear();
    showToast('Storage cleared', 'info');
    window.location.reload();
  };

  useEffect(() => {
    console.log('LoginTest: Auth state changed:', { user, isAuthenticated, isLoading, currentView });
    
    // Auto redirect to dashboard if authenticated
    if (isAuthenticated && currentView === 'login') {
      console.log('LoginTest: User is authenticated, auto-redirecting to dashboard');
      setCurrentView('dashboard');
    }
  }, [user, isAuthenticated, isLoading, currentView]);

  // Render dashboard view
  if (currentView === 'dashboard') {
    return (
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h1>Dashboard Test</h1>
        
        <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', backgroundColor: '#f0f8ff' }}>
          <h3>Dashboard State</h3>
          <p>✅ User is authenticated!</p>
          <p>Welcome, {user?.full_name || user?.username}!</p>
          <p>Email: {user?.email}</p>
          <p>Role: {user?.role}</p>
        </div>

        <div>
          <button 
            onClick={handleLogout} 
            style={{ margin: '5px', padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            Logout
          </button>
          <button 
            onClick={handleGoLogin} 
            style={{ margin: '5px', padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            Back to Login View
          </button>
          <button 
            onClick={handleGoRealDashboard} 
            style={{ margin: '5px', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            Go to Real Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Render login view

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Login Test Page</h1>
      
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h3>Auth State</h3>
        <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
        <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
        <p>User: {user ? user.username : 'None'}</p>
        <p>Token in Storage: {localStorage.getItem('auth_token') ? 'Yes' : 'No'}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Login Form</h3>
        <input
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          placeholder="Username"
          style={{ margin: '5px', padding: '5px' }}
        />
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="Password"
          style={{ margin: '5px', padding: '5px' }}
        />
        <button 
          onClick={handleLogin} 
          disabled={loading}
          style={{ margin: '5px', padding: '5px 10px' }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>

      <div>
        <h3>Navigation Test</h3>
        <button 
          onClick={handleGoDashboard} 
          style={{ margin: '5px', padding: '5px 10px', backgroundColor: isAuthenticated ? '#28a745' : '#6c757d', color: 'white', border: 'none', borderRadius: '3px' }}
        >
          Go to Dashboard {!isAuthenticated && '(Login Required)'}
        </button>
        <button 
          onClick={handleGoRealLogin} 
          style={{ margin: '5px', padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px' }}
        >
          Go to Real Login Page
        </button>
        <button 
          onClick={handleGoRealDashboard} 
          style={{ margin: '5px', padding: '5px 10px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '3px' }}
        >
          Go to Real Dashboard
        </button>
        <button onClick={handleStorageTest} style={{ margin: '5px', padding: '5px 10px' }}>
          Set Test Token
        </button>
        <button onClick={handleClearStorage} style={{ margin: '5px', padding: '5px 10px' }}>
          Clear Storage & Reload
        </button>
      </div>
    </div>
  );
};
