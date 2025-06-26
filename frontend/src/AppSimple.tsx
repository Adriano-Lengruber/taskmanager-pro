import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import LoadingSpinner from './components/LoadingSpinner';
import { AuthDebug } from './components/AuthDebug';
import { RegisterComplete } from './pages/RegisterComplete';
import { Dashboard } from './pages/Dashboard';
import { LoginTest } from './pages/LoginTest';
import Login from './pages/Login';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Simple route protection component
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Redirect authenticated users away from public routes
const RedirectIfAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

function AppSimple() {
  console.log('AppSimple: Rendering...');
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <AuthDebug />
            <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
              <Routes>
                <Route path="/test" element={<LoginTest />} />
                <Route 
                  path="/register" 
                  element={
                    <RedirectIfAuth>
                      <RegisterComplete />
                    </RedirectIfAuth>
                  } 
                />
                <Route 
                  path="/login" 
                  element={
                    <RedirectIfAuth>
                      <Login />
                    </RedirectIfAuth>
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <RequireAuth>
                      <Dashboard />
                    </RequireAuth>
                  } 
                />              
                <Route 
                  path="/" 
                  element={<Navigate to="/test" replace />} 
                />
                <Route 
                  path="*" 
                  element={<Navigate to="/test" replace />} 
                />
              </Routes>
            </div>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default AppSimple;
