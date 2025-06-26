import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeftIcon, 
  CalendarIcon, 
  UserIcon,
  KeyIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import { projectService } from '../services/projects';
import ProjectMembers from '../components/ProjectMembers';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const projectId = parseInt(id || '0');
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'tasks'>('overview');

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectService.getProject(projectId),
    enabled: !!projectId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800">
          Erro ao carregar projeto.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/projects"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Voltar para Projetos
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                <KeyIcon className="w-3 h-3 mr-1" />
                {project.key}
              </span>
              {project.is_active && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <CheckCircleIcon className="w-3 h-3 mr-1" />
                  Ativo
                </span>
              )}
            </div>
            {project.description && (
              <p className="mt-2 text-gray-600">{project.description}</p>
            )}
            <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <UserIcon className="w-4 h-4 mr-1" />
                Proprietário: ID {project.owner_id}
              </div>
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-1" />
                Criado em {new Date(project.created_at).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'members'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Membros
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tasks'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tarefas
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Informações do Projeto
                </h3>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Nome</dt>
                    <dd className="mt-1 text-sm text-gray-900">{project.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Chave</dt>
                    <dd className="mt-1 text-sm text-gray-900">{project.key}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {project.is_active ? 'Ativo' : 'Inativo'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Criado em</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(project.created_at).toLocaleDateString('pt-BR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Descrição</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {project.description || 'Nenhuma descrição fornecida.'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <ProjectMembers projectId={projectId} />
          )}

          {activeTab === 'tasks' && (
            <div className="text-center py-8">
              <div className="text-gray-500">
                Seção de tarefas em desenvolvimento...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
