import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProviderSimple, useAuthSimple } from './contexts/AuthContextSimple';
import { ToastProvider } from './contexts/ToastContext';
import { LoginTest } from './pages/LoginTest';
import { DashboardSimple } from './pages/DashboardSimple';
import LoginSimple from './pages/LoginSimple';
import LoadingSpinner from './components/LoadingSpinner';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthSimple();
  
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

// Public Route Component (redirect if already authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthSimple();
  
  console.log('PublicRoute: Checking access -', { isAuthenticated, isLoading });
  
  if (isLoading) {
    console.log('PublicRoute: Still loading, showing spinner');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (isAuthenticated) {
    console.log('PublicRoute: User is authenticated, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }
  
  console.log('PublicRoute: User not authenticated, showing public content');
  return <>{children}</>;
};

function AppBasic() {
  console.log('AppBasic: Rendering...');
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProviderSimple>
        <ToastProvider>
          <Router>
            <Routes>
              <Route path="/test" element={<LoginTest />} />
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <LoginSimple />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardSimple />
                  </ProtectedRoute>
                } 
              />
              <Route path="/" element={<Navigate to="/test" replace />} />
              <Route path="*" element={<Navigate to="/test" replace />} />
            </Routes>
          </Router>
        </ToastProvider>
      </AuthProviderSimple>
    </QueryClientProvider>
  );
}

export default AppBasic;
