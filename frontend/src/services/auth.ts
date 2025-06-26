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
    console.log('AuthService: Attempting login for', credentials.username);
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    const response = await apiClient.post<AuthToken>('/api/v1/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    console.log('AuthService: Login response received', response.data);
    return response.data;
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
