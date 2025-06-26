import axios from 'axios';
import type { 
  Checklist, ChecklistCreate, ChecklistUpdate, ChecklistWithItems,
  ActionItem, ActionItemCreate, ActionItemUpdate,
  TaskWithHierarchy, TaskCompletion
} from '../types/api';

const API_BASE_URL = 'http://localhost:8000/api/v1';

// Create axios instance with auth token
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const hierarchyService = {
  // Checklist operations
  async createChecklist(taskId: number, checklist: ChecklistCreate): Promise<Checklist> {
    const response = await api.post(`/tasks/${taskId}/checklists`, checklist);
    return response.data;
  },

  async getTaskChecklists(taskId: number): Promise<ChecklistWithItems[]> {
    const response = await api.get(`/tasks/${taskId}/checklists`);
    return response.data;
  },

  async updateChecklist(checklistId: number, update: ChecklistUpdate): Promise<Checklist> {
    const response = await api.put(`/checklists/${checklistId}`, update);
    return response.data;
  },

  async deleteChecklist(checklistId: number): Promise<void> {
    await api.delete(`/checklists/${checklistId}`);
  },

  // Action Item operations
  async createActionItem(checklistId: number, actionItem: ActionItemCreate): Promise<ActionItem> {
    const response = await api.post(`/checklists/${checklistId}/action-items`, actionItem);
    return response.data;
  },

  async getChecklistActionItems(checklistId: number): Promise<ActionItem[]> {
    const response = await api.get(`/checklists/${checklistId}/action-items`);
    return response.data;
  },

  async updateActionItem(actionItemId: number, update: ActionItemUpdate): Promise<ActionItem> {
    const response = await api.put(`/action-items/${actionItemId}`, update);
    return response.data;
  },

  async deleteActionItem(actionItemId: number): Promise<void> {
    await api.delete(`/action-items/${actionItemId}`);
  },

  // Hierarchy operations
  async getTaskHierarchy(taskId: number): Promise<TaskWithHierarchy> {
    const response = await api.get(`/tasks/${taskId}/hierarchy`);
    return response.data;
  },

  async getProjectTaskTree(projectId: number): Promise<TaskWithHierarchy[]> {
    const response = await api.get(`/projects/${projectId}/task-tree`);
    return response.data;
  },

  async getTaskCompletion(taskId: number): Promise<TaskCompletion> {
    const response = await api.get(`/tasks/${taskId}/completion`);
    return response.data;
  },

  async getUserActionItems(userId: number, completed?: boolean): Promise<ActionItem[]> {
    const params = completed !== undefined ? { completed } : {};
    const response = await api.get(`/users/${userId}/action-items`, { params });
    return response.data;
  },

  // Toggle completion helpers
  async toggleChecklistCompletion(checklistId: number, completed: boolean): Promise<Checklist> {
    return this.updateChecklist(checklistId, { is_completed: completed });
  },

  async toggleActionItemCompletion(actionItemId: number, completed: boolean): Promise<ActionItem> {
    return this.updateActionItem(actionItemId, { is_completed: completed });
  },
};

export default hierarchyService;
