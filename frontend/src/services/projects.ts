import apiClient from '../lib/api';
import type { 
  Project, 
  ProjectCreate, 
  ProjectUpdate, 
  PaginatedResponse
} from '../types/api';

export const projectService = {
  // Get all projects
  async getProjects(skip = 0, limit = 100): Promise<PaginatedResponse<Project>> {
    const response = await apiClient.get<PaginatedResponse<Project>>(`/api/v1/projects/?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  // Get current user's projects
  async getMyProjects(skip = 0, limit = 100): Promise<PaginatedResponse<Project>> {
    const response = await apiClient.get<PaginatedResponse<Project>>(`/api/v1/projects/my?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  // Get project by ID
  async getProject(id: number): Promise<Project> {
    const response = await apiClient.get<Project>(`/api/v1/projects/${id}`);
    return response.data;
  },

  // Create new project
  async createProject(projectData: ProjectCreate): Promise<Project> {
    const response = await apiClient.post<Project>('/api/v1/projects/', projectData);
    return response.data;
  },

  // Update project
  async updateProject(id: number, projectData: ProjectUpdate): Promise<Project> {
    const response = await apiClient.put<Project>(`/api/v1/projects/${id}`, projectData);
    return response.data;
  },

  // Delete project
  async deleteProject(id: number): Promise<void> {
    await apiClient.delete(`/api/v1/projects/${id}`);
  }
};
