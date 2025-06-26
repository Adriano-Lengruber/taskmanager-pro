import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthSimple } from '../contexts/AuthContextSimple';
import { useToast } from '../contexts/SuperStableToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import type { UserLogin } from '../types/api';

const LoginSimple: React.FC = () => {
  const { login } = useAuthSimple();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [formData, setFormData] = useState<UserLogin>({
    username: 'testuser',
    password: 'testpass123'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('LoginSimple: Form submitted', formData.username);

    try {
      console.log('LoginSimple: Calling login function...');
      await login(formData);
      console.log('LoginSimple: Success! Redirecting to dashboard...');
      showToast('Login successful! Welcome back.', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('LoginSimple: Error occurred:', err);
      const errorMessage = err.response?.data?.detail || err.message || 'Login failed. Please try again.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoTest = () => {
    navigate('/test');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Welcome to TaskManager Pro
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="
                  mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg
                  shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500
                  focus:border-blue-500
                "
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="
                  mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg
                  shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500
                  focus:border-blue-500
                "
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="
                group relative w-full flex justify-center py-3 px-4 border border-transparent
                text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up here
              </Link>
            </p>
            <button
              type="button"
              onClick={handleGoTest}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Go to Test Page
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginSimple;
