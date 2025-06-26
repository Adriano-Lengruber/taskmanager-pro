import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/auth';
import type { User, UserLogin, UserRegister } from '../types/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: UserLogin) => Promise<void>;
  register: (userData: UserRegister) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProviderSimple({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Initialize auth state - mais simples
  useEffect(() => {
    console.log('AuthProviderSimple: Starting initialization...');
    
    setTimeout(() => {
      console.log('AuthProviderSimple: Checking token...');
      const token = authService.getToken();
      
      if (token) {
        console.log('AuthProviderSimple: Token found:', token.substring(0, 20) + '...');
        // Tentar buscar usuário
        authService.getCurrentUser()
          .then(userData => {
            console.log('AuthProviderSimple: User data retrieved:', userData);
            setUser(userData);
          })
          .catch(error => {
            console.error('AuthProviderSimple: Error getting user:', error);
            authService.logout();
          })
          .finally(() => {
            console.log('AuthProviderSimple: Setting loading to false');
            setIsLoading(false);
          });
      } else {
        console.log('AuthProviderSimple: No token found');
        setIsLoading(false);
      }
    }, 100);
  }, []);

  const login = async (credentials: UserLogin) => {
    console.log('AuthProviderSimple: Login attempt for:', credentials.username);
    setIsLoading(true);
    
    try {
      const token = await authService.login(credentials);
      console.log('AuthProviderSimple: Token received');
      authService.setToken(token.access_token);
      
      const userData = await authService.getCurrentUser();
      console.log('AuthProviderSimple: User data received:', userData.username);
      setUser(userData);
      authService.setStoredUser(userData);
    } catch (error) {
      console.error('AuthProviderSimple: Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: UserRegister) => {
    console.log('AuthProviderSimple: Register attempt for:', userData.username);
    setIsLoading(true);
    
    try {
      await authService.register(userData);
      console.log('AuthProviderSimple: Registration successful, auto-login...');
      await login({ username: userData.username, password: userData.password });
    } catch (error) {
      console.error('AuthProviderSimple: Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('AuthProviderSimple: Logout');
    authService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout
  };

  console.log('AuthProviderSimple: Rendering with state:', { isAuthenticated, isLoading, user: user?.username });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthSimple() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthSimple must be used within an AuthProviderSimple');
  }
  return context;
}
