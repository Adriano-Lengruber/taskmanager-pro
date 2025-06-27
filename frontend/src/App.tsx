import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SuperStableToastProvider } from './contexts/SuperStableToastContext';
import { LanguageProvider } from './contexts/LanguageContext';
import ErrorBoundary from './components/ErrorBoundary';

// Components
import { Dashboard } from './pages/Dashboard';
import Login from './pages/Login';
import { Register } from './pages/Register';
import { Projects } from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import { Tasks } from './pages/Tasks';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';

// React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route Component (redirect if not authenticated)
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  try {
    const { isAuthenticated, isLoading } = useAuth();

    console.log('🔒 ProtectedRoute - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);

    if (isLoading) {
      console.log('🔒 ProtectedRoute - Showing loading spinner');
      return <LoadingSpinner fullScreen size="lg" message="Verificando autenticação..." />;
    }

    if (!isAuthenticated) {
      console.log('🔒 ProtectedRoute - Redirecting to /login');
      return <Navigate to="/login" replace />;
    }

    console.log('🔒 ProtectedRoute - Showing protected content');
    return <>{children}</>;
  } catch (error) {
    console.error('🔒 ProtectedRoute - Auth context not available:', error);
    return <Navigate to="/login" replace />;
  }
}

// Public Route Component (redirect if authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  try {
    const { isAuthenticated, isLoading } = useAuth();

    console.log('🌐 PublicRoute - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);

    if (isLoading) {
      console.log('🌐 PublicRoute - Showing loading spinner');
      return <LoadingSpinner fullScreen size="lg" message="Carregando aplicação..." />;
    }

    if (isAuthenticated) {
      console.log('🌐 PublicRoute - Redirecting to /dashboard');
      return <Navigate to="/dashboard" replace />;
    }

    console.log('🌐 PublicRoute - Showing public content');
    return <>{children}</>;
  } catch (error) {
    console.error('🌐 PublicRoute - Auth context not available:', error);
    return <LoadingSpinner fullScreen size="lg" message="Inicializando..." />;
  }
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />

      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectDetail />} />
        <Route path="tasks" element={<Tasks />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthProvider>
            <SuperStableToastProvider>
              <Router>
                <div className="min-h-screen bg-gray-50">
                  <AppRoutes />
                </div>
              </Router>
            </SuperStableToastProvider>
          </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
