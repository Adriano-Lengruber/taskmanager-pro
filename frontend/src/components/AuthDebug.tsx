import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const AuthDebug: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('AuthDebug:', {
        user,
        isAuthenticated,
        isLoading,
        token: localStorage.getItem('auth_token'),
        userData: localStorage.getItem('user_data')
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [user, isAuthenticated, isLoading]);

  return (
    <div style={{ 
      position: 'fixed', 
      top: 10, 
      right: 10, 
      background: 'white', 
      border: '1px solid black', 
      padding: '10px',
      fontSize: '12px',
      zIndex: 9999
    }}>
      <h4>Auth Debug</h4>
      <p>Loading: {isLoading ? 'true' : 'false'}</p>
      <p>Authenticated: {isAuthenticated ? 'true' : 'false'}</p>
      <p>User: {user ? user.username : 'null'}</p>
      <p>Token: {localStorage.getItem('auth_token') ? 'exists' : 'null'}</p>
    </div>
  );
};
