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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      console.log('AuthContext: Initializing authentication...');
      
      try {
        if (authService.isAuthenticated()) {
          console.log('AuthContext: Token found, verifying with server...');
          const userData = await authService.getCurrentUser();
          console.log('AuthContext: User data retrieved:', userData);
          setUser(userData);
          authService.setStoredUser(userData);
          console.log('AuthContext: User authenticated successfully');
        } else {
          console.log('AuthContext: No token found, user not authenticated');
        }
      } catch (error) {
        console.error('AuthContext: Error during initialization:', error);
        // Token is invalid, clear stored data
        authService.logout();
        setUser(null);
      } finally {
        console.log('AuthContext: Initialization complete, setting loading to false');
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: UserLogin) => {
    setIsLoading(true);
    try {
      console.log('AuthContext: Attempting login...', credentials.username);
      const token = await authService.login(credentials);
      authService.setToken(token.access_token);
      console.log('AuthContext: Login successful, token stored');
      
      const userData = await authService.getCurrentUser();
      console.log('AuthContext: User data received:', userData);
      setUser(userData);
      authService.setStoredUser(userData);
      console.log('AuthContext: Login process completed successfully');
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: UserRegister) => {
    setIsLoading(true);
    try {
      console.log('AuthContext: Attempting registration...', userData.username);
      console.log('AuthContext: Registration data:', userData);
      
      const result = await authService.register(userData);
      console.log('AuthContext: Registration successful:', result);
      
      // After registration, automatically login
      console.log('AuthContext: Auto-login after registration...');
      await login({
        username: userData.username,
        password: userData.password
      });
    } catch (error) {
      console.error('AuthContext: Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('AuthContext: Logging out user');
    authService.logout();
    setUser(null);
    console.log('AuthContext: Logout completed');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
