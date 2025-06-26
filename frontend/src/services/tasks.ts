import apiClient from '../lib/api';
import type { 
  Task, 
  TaskCreate, 
  TaskUpdate, 
  TaskFilters, 
  PaginatedResponse
} from '../types/api';

export const taskService = {
  // Get tasks with filters
  async getTasks(filters: TaskFilters = {}): Promise<PaginatedResponse<Task>> {
    const params = new URLSearchParams();
    
    if (filters.project_id) params.append('project_id', filters.project_id.toString());
    if (filters.status) params.append('status', filters.status);
    if (filters.assignee_id) params.append('assignee_id', filters.assignee_id.toString());
    if (filters.skip) params.append('skip', filters.skip.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await apiClient.get<PaginatedResponse<Task>>(`/api/v1/tasks/?${params.toString()}`);
    return response.data;
  },

  // Get current user's tasks
  async getMyTasks(filters: Omit<TaskFilters, 'assignee_id'> = {}): Promise<PaginatedResponse<Task>> {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.skip) params.append('skip', filters.skip.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await apiClient.get<PaginatedResponse<Task>>(`/api/v1/tasks/my?${params.toString()}`);
    return response.data;
  },

  // Get task by ID
  async getTask(id: number): Promise<Task> {
    const response = await apiClient.get<Task>(`/api/v1/tasks/${id}`);
    return response.data;
  },

  // Create new task
  async createTask(taskData: TaskCreate): Promise<Task> {
    const response = await apiClient.post<Task>('/api/v1/tasks/', taskData);
    return response.data;
  },

  // Update task
  async updateTask(id: number, taskData: TaskUpdate): Promise<Task> {
    const response = await apiClient.put<Task>(`/api/v1/tasks/${id}`, taskData);
    return response.data;
  },

  // Delete task
  async deleteTask(id: number): Promise<void> {
    await apiClient.delete(`/api/v1/tasks/${id}`);
  },

  // Get task subtasks
  async getSubtasks(id: number): Promise<Task[]> {
    const response = await apiClient.get<Task[]>(`/api/v1/tasks/${id}/subtasks`);
    return response.data;
  }
};
