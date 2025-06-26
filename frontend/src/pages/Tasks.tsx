import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../contexts/ToastContext';
import { useLanguage } from '../contexts/LanguageContext';
import { taskService } from '../services/tasks';
import { projectService } from '../services/projects';
import { hierarchyService } from '../services/hierarchy';
import LoadingSpinner from '../components/LoadingSpinner';
import TaskHierarchy from '../components/TaskHierarchy';
import type { TaskCreate, TaskStatus, TaskPriority } from '../types/api';

export const Tasks: React.FC = () => {
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [showHierarchy, setShowHierarchy] = useState(false);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
  const [projectFilter, setProjectFilter] = useState<number | ''>('');
  const [formData, setFormData] = useState<TaskCreate>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    project_id: 0
  });
  const [error, setError] = useState('');

  const queryClient = useQueryClient();

  // Fetch tasks with filters
  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks', { status: statusFilter, project_id: projectFilter }],
    queryFn: () => taskService.getTasks({
      status: statusFilter || undefined,
      project_id: projectFilter || undefined
    })
  });

  // Fetch projects for the dropdown
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getProjects()
  });

  // Fetch task hierarchy when selectedTaskId changes
  const { data: taskHierarchy, isLoading: hierarchyLoading } = useQuery({
    queryKey: ['task-hierarchy', selectedTaskId],
    queryFn: () => selectedTaskId ? hierarchyService.getTaskHierarchy(selectedTaskId) : null,
    enabled: !!selectedTaskId && showHierarchy
  });

  const createMutation = useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsCreateModalOpen(false);
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        project_id: 0
      });
      setError('');
    },
    onError: (error: any) => {
      setError(error.response?.data?.detail || 'Failed to create task');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TaskCreate> }) => 
      taskService.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      showToast('Tarefa atualizada com sucesso!', 'success');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || 'Falha ao atualizar tarefa';
      showToast(`Falha ao atualizar tarefa: ${errorMessage}`, 'error');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      showToast(t.tasks.taskDeleted, 'success');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || 'Falha ao excluir tarefa';
      showToast(`Falha ao excluir tarefa: ${errorMessage}`, 'error');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.project_id) {
      setError('Title and project are required');
      return;
    }
    createMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'project_id' ? parseInt(value) : value
    }));
  };

  const handleStatusChange = (taskId: number, newStatus: TaskStatus) => {
    updateMutation.mutate({
      id: taskId,
      data: { status: newStatus }
    });
  };

  const handleDeleteTask = (taskId: number, taskTitle: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a tarefa "${taskTitle}"? Esta ação não pode ser desfeita.`)) {
      deleteMutation.mutate(taskId);
    }
  };

  const handleToggleHierarchy = (taskId: number) => {
    if (selectedTaskId === taskId && showHierarchy) {
      setShowHierarchy(false);
      setSelectedTaskId(null);
    } else {
      setSelectedTaskId(taskId);
      setShowHierarchy(true);
    }
  };

  const getStatusBadgeColor = (status: TaskStatus) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'in_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'done':
        return 'bg-green-100 text-green-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadgeColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (tasksLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.tasks.title}</h1>
          <p className="text-gray-600 mt-1">{t.tasks.subtitle}</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          {t.tasks.createTask}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-wrap gap-4">
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
              {t.tasks.status}
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TaskStatus | '')}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Todos os status</option>
              <option value="todo">{t.tasks.todo}</option>
              <option value="in_progress">{t.tasks.inProgress}</option>
              <option value="in_review">{t.tasks.inReview}</option>
              <option value="done">{t.tasks.done}</option>
              <option value="blocked">{t.tasks.blocked}</option>
            </select>
          </div>
          <div>
            <label htmlFor="projectFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Projeto
            </label>
            <select
              id="projectFilter"
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value ? parseInt(e.target.value) : '')}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Todos os projetos</option>
              {projects?.items.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      {tasks?.items.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">{t.tasks.noTasks}</h3>
          <p className="mt-1 text-sm text-gray-500">{t.tasks.noTasksDescription}</p>
          <div className="mt-6">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Create Task
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {tasks?.items.map((task) => (
              <li key={task.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={task.status === 'done'}
                          onChange={(e) => 
                            handleStatusChange(task.id, e.target.checked ? 'done' : 'todo')
                          }
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <p className={`text-sm font-medium ${
                          task.status === 'done' ? 'line-through text-gray-500' : 'text-gray-900'
                        }`}>
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                        )}
                        {/* Progress bar for tasks with hierarchy */}
                        {taskHierarchy && selectedTaskId === task.id && taskHierarchy.checklists && taskHierarchy.checklists.length > 0 && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                              <span>Progresso da hierarquia</span>
                              <span>
                                {Math.round(
                                  (taskHierarchy.checklists.reduce((total, cl) => 
                                    total + cl.action_items.filter(item => item.is_completed).length, 0
                                  ) / Math.max(1, taskHierarchy.checklists.reduce((total, cl) => 
                                    total + cl.action_items.length, 0
                                  ))) * 100
                                )}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                style={{
                                  width: `${Math.round(
                                    (taskHierarchy.checklists.reduce((total, cl) => 
                                      total + cl.action_items.filter(item => item.is_completed).length, 0
                                    ) / Math.max(1, taskHierarchy.checklists.reduce((total, cl) => 
                                      total + cl.action_items.length, 0
                                    ))) * 100
                                  )}%`
                                }}
                              />
                            </div>
                          </div>
                        )}
                        <div className="mt-2 flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(task.status)}`}>
                            {task.status.replace('_', ' ')}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          {projects?.items.find(p => p.id === task.project_id) && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {projects.items.find(p => p.id === task.project_id)?.name}
                            </span>
                          )}
                          {/* Indicador de hierarquia */}
                          {taskHierarchy && selectedTaskId === task.id && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                              </svg>
                              {taskHierarchy.checklists?.length || 0} listas
                              {taskHierarchy.checklists && taskHierarchy.checklists.length > 0 && (
                                <span className="ml-1">
                                  • {taskHierarchy.checklists.reduce((total, cl) => total + cl.action_items.length, 0)} itens
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleHierarchy(task.id)}
                        className={`inline-flex items-center px-3 py-1 border text-xs font-medium rounded transition-colors ${
                          selectedTaskId === task.id && showHierarchy 
                            ? 'border-blue-500 text-blue-700 bg-blue-50 hover:bg-blue-100' 
                            : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                        }`}
                        title={showHierarchy && selectedTaskId === task.id ? 'Ocultar hierarquia' : t.hierarchy.viewHierarchy}
                      >
                        <svg className={`w-4 h-4 mr-1 transition-transform ${showHierarchy && selectedTaskId === task.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        {t.hierarchy.hierarchy}
                        {selectedTaskId === task.id && showHierarchy && (
                          <span className="ml-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                            {taskHierarchy?.checklists?.length || 0}
                          </span>
                        )}
                      </button>
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                        className="text-sm border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="todo">{t.tasks.todo}</option>
                        <option value="in_progress">{t.tasks.inProgress}</option>
                        <option value="in_review">{t.tasks.inReview}</option>
                        <option value="done">{t.tasks.done}</option>
                        <option value="blocked">{t.tasks.blocked}</option>
                      </select>
                      <button
                        onClick={() => handleDeleteTask(task.id, task.title)}
                        disabled={deleteMutation.isPending}
                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 disabled:opacity-50"
                        title="Excluir tarefa"
                      >
                        {deleteMutation.isPending ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  {/* Task Hierarchy Section */}
                  {selectedTaskId === task.id && showHierarchy && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                            <h4 className="text-lg font-medium text-gray-900">{t.hierarchy.taskHierarchy}</h4>
                            {taskHierarchy?.checklists && taskHierarchy.checklists.length > 0 && (
                              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                {taskHierarchy.checklists.length} {taskHierarchy.checklists.length === 1 ? 'lista' : 'listas'}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              setShowHierarchy(false);
                              setSelectedTaskId(null);
                            }}
                            className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-200"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        
                        {hierarchyLoading ? (
                          <div className="flex items-center justify-center py-8">
                            <LoadingSpinner />
                            <span className="ml-2 text-gray-600">Carregando hierarquia...</span>
                          </div>
                        ) : taskHierarchy ? (
                          <TaskHierarchy 
                            task={taskHierarchy}
                            onUpdate={() => {
                              queryClient.invalidateQueries({ queryKey: ['tasks'] });
                              queryClient.invalidateQueries({ queryKey: ['task-hierarchy', selectedTaskId] });
                              showToast(t.hierarchy.hierarchyUpdated, 'success');
                            }}
                          />
                        ) : (
                          <div className="text-center py-8">
                            <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                            <p className="text-gray-500 text-sm">{t.hierarchy.noChecklists}</p>
                            <p className="text-gray-400 text-xs mt-1">{t.hierarchy.noChecklistsDescription}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Create Task Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">{t.tasks.createTask}</h3>
                <button
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setError('');
                    setFormData({
                      title: '',
                      description: '',
                      status: 'todo',
                      priority: 'medium',
                      project_id: 0
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    {t.tasks.taskTitle} *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="O que precisa ser feito?"
                  />
                </div>

                <div>
                  <label htmlFor="project_id" className="block text-sm font-medium text-gray-700">
                    Projeto *
                  </label>
                  <select
                    id="project_id"
                    name="project_id"
                    required
                    value={formData.project_id}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Selecione um projeto</option>
                    {projects?.items.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      {t.tasks.status}
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="todo">{t.tasks.todo}</option>
                      <option value="in_progress">{t.tasks.inProgress}</option>
                      <option value="in_review">{t.tasks.inReview}</option>
                      <option value="done">{t.tasks.done}</option>
                      <option value="blocked">{t.tasks.blocked}</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                      {t.tasks.priority}
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="low">{t.tasks.low}</option>
                      <option value="medium">{t.tasks.medium}</option>
                      <option value="high">{t.tasks.high}</option>
                      <option value="urgent">Urgente</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    {t.tasks.taskDescription}
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Descrição da tarefa..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setError('');
                      setFormData({
                        title: '',
                        description: '',
                        status: 'todo',
                        priority: 'medium',
                        project_id: 0
                      });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {t.common.cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {createMutation.isPending ? (
                      <div className="flex items-center">
                        <LoadingSpinner size="sm" />
                        <span className="ml-2">{t.common.loading}</span>
                      </div>
                    ) : (
                      t.tasks.createTask
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
