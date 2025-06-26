import apiClient from '../lib/api';
import type { 
  AuthToken, 
  User, 
  UserLogin, 
  UserRegister, 
  APIResponse 
} from '../types/api';

export const authService = {
  // Login user
  async login(credentials: UserLogin): Promise<AuthToken> {
    console.log('🚀 AuthService: Attempting login for', credentials.username);
    console.log('🚀 AuthService: API URL will be:', 'http://localhost:8000/api/v1/auth/login');
    
    // OAuth2PasswordRequestForm espera application/x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    console.log('🚀 AuthService: Form data created:', formData.toString());
    
    try {
      console.log('🚀 AuthService: Making request...');
      const response = await apiClient.post<AuthToken>('/api/v1/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      console.log('✅ AuthService: Login SUCCESS - response received', response.data);
      return response.data;
    } catch (error: any) {
      console.error('🔥🔥🔥 AuthService: Login ERROR caught:', error);
      console.error('🔥🔥🔥 AuthService: Error response:', error.response);
      console.error('🔥🔥🔥 AuthService: Error status:', error.response?.status);
      console.error('🔥🔥🔥 AuthService: Error data:', error.response?.data);
      console.error('🔥🔥🔥 AuthService: Error message:', error.message);
      console.error('🔥🔥🔥 AuthService: Error config:', error.config);
      
      // Re-throw the error to be caught by the calling function
      console.log('🔥🔥🔥 AuthService: Re-throwing error for upper layer to handle...');
      throw error;
    }
  },

  // Register user
  async register(userData: UserRegister): Promise<APIResponse> {
    console.log('AuthService: Attempting registration for', userData.username);
    console.log('AuthService: Registration data:', userData);
    
    try {
      const response = await apiClient.post<APIResponse>('/api/v1/auth/register', userData);
      console.log('AuthService: Registration response received', response.data);
      return response.data;
    } catch (error: any) {
      console.error('AuthService: Registration error', error);
      console.error('AuthService: Registration error response', error.response);
      throw error;
    }
  },

  // Get current user info
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/api/v1/auth/me');
    return response.data;
  },

  // Logout (client-side only for now)
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  },

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  // Store token
  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  },

  // Get stored user data
  getStoredUser(): User | null {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },

  // Store user data
  setStoredUser(user: User): void {
    localStorage.setItem('user_data', JSON.stringify(user));
  }
};
