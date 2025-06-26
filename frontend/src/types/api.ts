// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PaginatedResponse<T = any> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

// User Types
export type UserRole = 'admin' | 'manager' | 'developer' | 'viewer';

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserCreate {
  username: string;
  email: string;
  full_name: string;
  password: string;
  avatar_url?: string;
  role?: UserRole;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface UserRegister extends UserCreate {
  confirm_password: string;
}

// Auth Types
export interface AuthToken {
  access_token: string;
  token_type: string;
}

export interface AuthUser extends User {}

// Project Types
export interface Project {
  id: number;
  name: string;
  description?: string;
  key: string;
  owner_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectCreate {
  name: string;
  description?: string;
  key: string;
}

export interface ProjectUpdate {
  name?: string;
  description?: string;
  is_active?: boolean;
}

// Task Types
export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done' | 'blocked';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  project_id: number;
  assignee_id?: number;
  parent_task_id?: number;
  due_date?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  project_id: number;
  assignee_id?: number;
  parent_task_id?: number;
  due_date?: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignee_id?: number;
  due_date?: string;
  completed_at?: string;
}

// Filter Types
export interface TaskFilters {
  project_id?: number;
  status?: TaskStatus;
  assignee_id?: number;
  skip?: number;
  limit?: number;
}
