import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  UserPlusIcon, 
  TrashIcon, 
  PencilIcon,
  UserGroupIcon 
} from '@heroicons/react/24/outline';
import { projectMemberService } from '../services/projectMembers';
import AddMemberModal from './AddMemberModal';
import type { ProjectMember, ProjectRole } from '../types/api';

interface ProjectMembersProps {
  projectId: number;
}

const roleLabels: Record<ProjectRole, string> = {
  OWNER: 'Proprietário',
  ADMIN: 'Administrador',
  MEMBER: 'Membro',
  VIEWER: 'Visualizador',
};

const roleColors: Record<ProjectRole, string> = {
  OWNER: 'bg-purple-100 text-purple-800',
  ADMIN: 'bg-red-100 text-red-800',
  MEMBER: 'bg-blue-100 text-blue-800',
  VIEWER: 'bg-gray-100 text-gray-800',
};

export default function ProjectMembers({ projectId }: ProjectMembersProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState<ProjectMember | null>(null);
  const [newRole, setNewRole] = useState<ProjectRole>('MEMBER');
  const queryClient = useQueryClient();

  // Buscar membros do projeto
  const { data: members = [], isLoading, error } = useQuery({
    queryKey: ['project-members', projectId],
    queryFn: () => projectMemberService.getProjectMembers(projectId),
  });

  // Mutation para atualizar role
  const updateRoleMutation = useMutation({
    mutationFn: ({ memberId, role }: { memberId: number; role: ProjectRole }) =>
      projectMemberService.updateMemberRole(projectId, memberId, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-members', projectId] });
      setEditingMember(null);
    },
  });

  // Mutation para remover membro
  const removeMemberMutation = useMutation({
    mutationFn: (userId: number) =>
      projectMemberService.removeMember(projectId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-members', projectId] });
    },
  });

  const handleUpdateRole = (member: ProjectMember) => {
    setEditingMember(member);
    setNewRole(member.role);
  };

  const handleSaveRole = () => {
    if (editingMember) {
      updateRoleMutation.mutate({ 
        memberId: editingMember.id, 
        role: newRole 
      });
    }
  };

  const handleRemoveMember = (member: ProjectMember) => {
    if (confirm(`Tem certeza que deseja remover ${member.user.full_name} do projeto?`)) {
      removeMemberMutation.mutate(member.user_id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Carregando membros...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800">
          Erro ao carregar membros do projeto.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <UserGroupIcon className="w-5 h-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Membros do Projeto ({members.length})
            </h3>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <UserPlusIcon className="w-4 h-4 mr-2" />
            Adicionar Membro
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {members.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhum membro
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Adicione membros para colaborar neste projeto.
            </p>
          </div>
        ) : (
          members.map((member) => (
            <div key={member.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {member.user.full_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {member.user.full_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      @{member.user.username} • {member.user.email}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Adicionado em {new Date(member.joined_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {editingMember && editingMember.id === member.id ? (
                    <div className="flex items-center space-x-2">
                      <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value as ProjectRole)}
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="MEMBER">Membro</option>
                        <option value="ADMIN">Administrador</option>
                        <option value="VIEWER">Visualizador</option>
                      </select>
                      <button
                        onClick={handleSaveRole}
                        disabled={updateRoleMutation.isPending}
                        className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={() => setEditingMember(null)}
                        className="text-xs bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[member.role]}`}>
                        {roleLabels[member.role]}
                      </span>
                      
                      {member.role !== 'OWNER' && (
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleUpdateRole(member)}
                            className="text-gray-400 hover:text-gray-600"
                            title="Editar role"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRemoveMember(member)}
                            disabled={removeMemberMutation.isPending}
                            className="text-gray-400 hover:text-red-600"
                            title="Remover membro"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <AddMemberModal
        projectId={projectId}
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
}
