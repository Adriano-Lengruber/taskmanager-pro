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
export type TaskType = 'task' | 'subtask' | 'checklist' | 'action_item';

export interface Task {
  id: number;
  title: string;
  description?: string;
  task_type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  project_id: number;
  assignee_id?: number;
  parent_task_id?: number;
  due_date?: string;
  start_date?: string;
  estimated_hours?: number;
  order_index: number;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
  task_type?: TaskType;
  status?: TaskStatus;
  priority?: TaskPriority;
  project_id: number;
  assignee_id?: number;
  parent_task_id?: number;
  due_date?: string;
  start_date?: string;
  estimated_hours?: number;
  order_index?: number;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  task_type?: TaskType;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignee_id?: number;
  due_date?: string;
  start_date?: string;
  estimated_hours?: number;
  order_index?: number;
  completed_at?: string;
}

// Checklist Types
export interface Checklist {
  id: number;
  title: string;
  description?: string;
  task_id: number;
  order_index: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface ChecklistCreate {
  title: string;
  description?: string;
  task_id: number;
  order_index?: number;
}

export interface ChecklistUpdate {
  title?: string;
  description?: string;
  order_index?: number;
  is_completed?: boolean;
}

// Action Item Types
export interface ActionItem {
  id: number;
  title: string;
  description?: string;
  checklist_id: number;
  assignee_id?: number;
  priority: TaskPriority;
  due_date?: string;
  order_index: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface ActionItemCreate {
  title: string;
  description?: string;
  checklist_id: number;
  assignee_id?: number;
  priority?: TaskPriority;
  due_date?: string;
  order_index?: number;
}

export interface ActionItemUpdate {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  assignee_id?: number;
  due_date?: string;
  order_index?: number;
  is_completed?: boolean;
}

// Hierarchy Types
export interface ChecklistWithItems extends Checklist {
  action_items: ActionItem[];
}

export interface TaskWithHierarchy extends Task {
  subtasks: TaskWithHierarchy[];
  checklists: ChecklistWithItems[];
}

// Alias para compatibilidade
export interface TaskCompleteHierarchy extends TaskWithHierarchy {}

// Response types para API
export interface ActionItemResponse extends ActionItem {}
export interface ChecklistResponse extends Checklist {}

export interface TaskCompletion {
  task_id: number;
  completion_percentage: number;
  status: TaskStatus;
}

// Filter Types
export interface TaskFilters {
  project_id?: number;
  status?: TaskStatus;
  assignee_id?: number;
  skip?: number;
  limit?: number;
}

// Project Member Types
export type ProjectRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';

export interface ProjectMember {
  id: number;
  project_id: number;
  user_id: number;
  role: ProjectRole;
  joined_at: string;
  is_active: boolean;
  user: User;
}

export interface ProjectMemberCreate {
  user_id: number;
  role?: ProjectRole;
}

export interface ProjectMemberUpdate {
  role?: ProjectRole;
  is_active?: boolean;
}

export interface UserProject {
  membership_id: number;
  role: ProjectRole;
  joined_at: string;
  project: Project;
}
