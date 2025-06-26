import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { XMarkIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { projectMemberService } from '../services/projectMembers';
import type { ProjectRole, User } from '../types/api';

interface AddMemberModalProps {
  projectId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function AddMemberModal({ projectId, isOpen, onClose }: AddMemberModalProps) {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<ProjectRole>('MEMBER');
  const queryClient = useQueryClient();

  // Buscar todos os usuários para selecionar
  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      // Implementar busca de usuários no userService se necessário
      return [] as User[];
    },
    enabled: isOpen,
  });

  // Mutation para adicionar membro
  const addMemberMutation = useMutation({
    mutationFn: (data: { user_id: number; role: ProjectRole }) =>
      projectMemberService.addMember(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-members', projectId] });
      onClose();
      setSelectedUserId(null);
      setSelectedRole('MEMBER');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserId) {
      addMemberMutation.mutate({
        user_id: selectedUserId,
        role: selectedRole,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Adicionar Membro ao Projeto
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-1">
              Usuário
            </label>
            <select
              id="user"
              value={selectedUserId || ''}
              onChange={(e) => setSelectedUserId(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loadingUsers}
            >
              <option value="">Selecione um usuário</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.full_name} ({user.username})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              id="role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as ProjectRole)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="MEMBER">Membro</option>
              <option value="ADMIN">Administrador</option>
              <option value="VIEWER">Visualizador</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!selectedUserId || addMemberMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <UserPlusIcon className="w-4 h-4 mr-2" />
              {addMemberMutation.isPending ? 'Adicionando...' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
