import api from '../lib/api';
import type { 
  ProjectMember, 
  ProjectMemberCreate, 
  ProjectMemberUpdate,
  UserProject,
  APIResponse 
} from '../types/api';

export const projectMemberService = {
  // Adicionar membro ao projeto
  async addMember(projectId: number, memberData: ProjectMemberCreate): Promise<APIResponse> {
    const response = await api.post(`/projects/${projectId}/members`, memberData);
    return response.data;
  },

  // Listar membros do projeto
  async getProjectMembers(projectId: number): Promise<ProjectMember[]> {
    const response = await api.get(`/projects/${projectId}/members`);
    return response.data;
  },

  // Atualizar role do membro
  async updateMemberRole(
    projectId: number, 
    memberId: number, 
    updates: ProjectMemberUpdate
  ): Promise<APIResponse> {
    const response = await api.put(`/projects/${projectId}/members/${memberId}`, updates);
    return response.data;
  },

  // Remover membro do projeto
  async removeMember(projectId: number, userId: number): Promise<APIResponse> {
    const response = await api.delete(`/projects/${projectId}/members/${userId}`);
    return response.data;
  },

  // Listar projetos do usuário
  async getUserProjects(userId: number): Promise<UserProject[]> {
    const response = await api.get(`/users/${userId}/projects`);
    return response.data;
  }
};
