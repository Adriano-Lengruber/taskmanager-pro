import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { LanguageProvider } from './contexts/LanguageContext';
import LoadingSpinner from './components/LoadingSpinner';
import { RegisterComplete } from './pages/RegisterComplete';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { Tasks } from './pages/Tasks';
import Layout from './components/Layout';
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

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; requireAuth?: boolean }> = ({ 
  children, 
  requireAuth = true 
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  console.log('App: Rendering with AuthProvider and ToastProvider');
  
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <Router>
              <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>            <Routes>
              <Route 
                path="/register" 
                element={
                  <ProtectedRoute requireAuth={false}>
                    <RegisterComplete />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/login" 
                element={
                  <ProtectedRoute requireAuth={false}>
                    <Login />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/"
                element={
                  <ProtectedRoute requireAuth={true}>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="projects" element={<Projects />} />
                <Route path="tasks" element={<Tasks />} />
              </Route>
              <Route 
                path="*" 
                element={<Navigate to="/login" replace />} 
              />
            </Routes>
            </div>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
