import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-      <Route path="/login" element={<Login />} />
      <Route path="/login-minimal" element={<LoginMinimal />} />mport { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SuperStableToastProvider } from './contexts/SuperStableToastContext';
import { LanguageProvider } from './contexts/LanguageContext';
import ErrorBoundary from './components/ErrorBoundary';

// Components (to be created)
import { Dashboard } from './pages/Dashboard';
import Login from './pages/Login';
import { RegisterSimple } from './pages/RegisterSimple';
import { RegisterSimpleToastTest } from './pages/RegisterSimpleToastTest';
import { Projects } from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import { Tasks } from './pages/Tasks';
import TestPage from './pages/TestPage';
import ToastTestPage from './pages/ToastTestPage';
import LoginToastDebugPage from './pages/LoginToastDebugPage';
import AuthToastInteractionTest from './pages/AuthToastInteractionTest';
import GlobalToastTestPage from './pages/GlobalToastTestPage';
import SimpleToastTestPage from './pages/SimpleToastTestPage';
import LoginPageDebugger from './pages/LoginPageDebugger';
import LoginMinimal from './pages/LoginMinimal';
import LoginUltraMinimal from './pages/LoginUltraMinimal';
import LoginDebugSimple from './pages/LoginDebugSimple';
import LoginNoForm from './pages/LoginNoForm';
import LoginTestIsolated from './pages/LoginTestIsolated';
import LoginTestSimple from './pages/LoginTestSimple';
import LoginFullyIsolated from './pages/LoginFullyIsolated';
import LogoutTest from './pages/LogoutTest';
import IsolatedToastTestPage from './pages/IsolatedToastTestPage';
import UltraStableToastTest from './pages/UltraStableToastTest';
import LoginDiagnostic from './pages/LoginDiagnostic';
import AutoTestPage from './pages/AutoTestPage';
import SimpleToastTest from './pages/SimpleToastTest';
import AuthContextTest from './pages/AuthContextTest';
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
    // If auth context is not available, redirect to login
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
    // If auth context is not available, show loading
    return <LoadingSpinner fullScreen size="lg" message="Inicializando..." />;
  }
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/test" element={<TestPage />} />
      <Route path="/login" element={<Login />} />
      {/* Temporariamente removido PublicRoute para testar */
      {/* <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } /> */}
      <Route path="/login-minimal" element={<LoginMinimal />} />
      <Route path="/login-ultra-minimal" element={<LoginUltraMinimal />} />
      <Route path="/login-debug-simple" element={<LoginDebugSimple />} />
      <Route path="/login-no-form" element={<LoginNoForm />} />
      <Route path="/login-isolated" element={<LoginTestIsolated />} />
      <Route path="/login-test-simple" element={<LoginTestSimple />} />
      <Route path="/login-fully-isolated" element={<LoginFullyIsolated />} />
      <Route path="/login-diagnostic" element={<LoginDiagnostic />} />
      <Route path="/auto-test" element={<AutoTestPage />} />
      <Route path="/simple-toast-test" element={<SimpleToastTest />} />
      <Route path="/auth-context-test" element={<AuthContextTest />} />
      <Route path="/logout-test" element={<LogoutTest />} />
      <Route path="/register" element={<RegisterSimpleToastTest />} />
      <Route path="/register-simple" element={
        <PublicRoute>
          <RegisterSimple />
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
        <Route path="test" element={<TestPage />} />
        <Route path="toast-test" element={<ToastTestPage />} />
        <Route path="login-debug" element={<LoginToastDebugPage />} />
        <Route path="auth-toast-test" element={<AuthToastInteractionTest />} />
        <Route path="global-toast-test" element={<GlobalToastTestPage />} />
        <Route path="simple-toast-test" element={<SimpleToastTestPage />} />
        <Route path="login-page-debug" element={<LoginPageDebugger />} />
        <Route path="isolated-toast-test" element={<IsolatedToastTestPage />} />
        <Route path="ultra-stable-toast-test" element={<UltraStableToastTest />} />
      </Route>

      {/* Catch all route - TEMPORARILY DISABLED FOR DEBUG */}
      {/* <Route path="*" element={<Navigate to="/dashboard" replace />} /> */}
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
