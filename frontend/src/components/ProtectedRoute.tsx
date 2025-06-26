import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean; // true for protected routes, false for public routes (login/register)
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('ProtectedRoute: Auth state -', { isAuthenticated, isLoading, requireAuth });
    
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        // User needs to be authenticated but isn't - redirect to login
        console.log('ProtectedRoute: User not authenticated, redirecting to login');
        navigate('/login', { replace: true });
        return;
      }
      
      if (!requireAuth && isAuthenticated) {
        // User is authenticated but trying to access public route - redirect to dashboard
        console.log('ProtectedRoute: User already authenticated, redirecting to dashboard');
        navigate('/dashboard', { replace: true });
        return;
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, navigate]);

  // Show loading while checking authentication
  if (isLoading) {
    console.log('ProtectedRoute: Loading authentication state...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  // For protected routes, only render if authenticated
  if (requireAuth && !isAuthenticated) {
    console.log('ProtectedRoute: Protected route accessed without auth, showing nothing (will redirect)');
    return null; // Will redirect in useEffect
  }

  // For public routes, only render if not authenticated
  if (!requireAuth && isAuthenticated) {
    console.log('ProtectedRoute: Public route accessed with auth, showing nothing (will redirect)');
    return null; // Will redirect in useEffect
  }

  console.log('ProtectedRoute: Rendering children');
  return <>{children}</>;
};
