import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/SuperStableToastContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { hierarchyService } from '../services/hierarchy';
import type { 
  TaskCompleteHierarchy, 
  ChecklistWithItems,
  ChecklistCreate
} from '../types/api';
import { ActionItemComponent as ActionItem } from './ActionItem';

interface TaskHierarchyProps {
  task: TaskCompleteHierarchy;
  onUpdate?: () => void;
}

const TaskHierarchy: React.FC<TaskHierarchyProps> = ({ task, onUpdate }) => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [expandedChecklists, setExpandedChecklists] = useState<Set<number>>(new Set());
  const [isAddingChecklist, setIsAddingChecklist] = useState(false);
  const [newChecklistTitle, setNewChecklistTitle] = useState('');

  // Toggle checklist expansion
  const toggleChecklist = (checklistId: number) => {
    const newExpanded = new Set(expandedChecklists);
    if (newExpanded.has(checklistId)) {
      newExpanded.delete(checklistId);
    } else {
      newExpanded.add(checklistId);
    }
    setExpandedChecklists(newExpanded);
  };

  // Create checklist mutation
  const createChecklistMutation = useMutation({
    mutationFn: (data: ChecklistCreate) => hierarchyService.createChecklist(task.id, data),
    onSuccess: () => {
      showToast(t.hierarchy.checklistCreated, 'success');
      setIsAddingChecklist(false);
      setNewChecklistTitle('');
      queryClient.invalidateQueries({ queryKey: ['task-hierarchy', task.id] });
      onUpdate?.();
    },
    onError: () => {
      showToast(t.hierarchy.checklistCreateFailed, 'error');
    }
  });

  // Update checklist mutation
  const updateChecklistMutation = useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean }) => 
      hierarchyService.updateChecklist(id, { is_completed: completed }),
    onSuccess: () => {
      showToast(t.hierarchy.checklistUpdated, 'success');
      queryClient.invalidateQueries({ queryKey: ['task-hierarchy', task.id] });
      onUpdate?.();
    },
    onError: () => {
      showToast(t.hierarchy.checklistUpdateFailed, 'error');
    }
  });

  // Delete checklist mutation
  const deleteChecklistMutation = useMutation({
    mutationFn: (checklistId: number) => hierarchyService.deleteChecklist(checklistId),
    onSuccess: () => {
      showToast(t.hierarchy.checklistDeleted, 'success');
      queryClient.invalidateQueries({ queryKey: ['task-hierarchy', task.id] });
      onUpdate?.();
    },
    onError: () => {
      showToast(t.hierarchy.checklistDeleteFailed, 'error');
    }
  });

  const handleCreateChecklist = () => {
    if (!newChecklistTitle.trim()) return;

    createChecklistMutation.mutate({
      title: newChecklistTitle,
      description: '',
      order_index: task.checklists.length,
      task_id: task.id
    });
  };

  const handleToggleChecklist = (checklistId: number, completed: boolean) => {
    updateChecklistMutation.mutate({ id: checklistId, completed });
  };

  const handleDeleteChecklist = (checklistId: number) => {
    if (confirm(t.hierarchy.deleteChecklistConfirm)) {
      deleteChecklistMutation.mutate(checklistId);
    }
  };

  const calculateChecklistProgress = (checklist: ChecklistWithItems) => {
    if (checklist.action_items.length === 0) return 0;
    const completed = checklist.action_items.filter(item => item.is_completed).length;
    return Math.round((completed / checklist.action_items.length) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-blue-600">{task.checklists?.length || 0}</div>
          <div className="text-sm text-gray-600">{t.hierarchy.checklists}</div>
        </div>
        <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-green-600">
            {task.checklists?.reduce((total, cl) => total + cl.action_items.length, 0) || 0}
          </div>
          <div className="text-sm text-gray-600">{t.hierarchy.actionItems}</div>
        </div>
        <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {task.checklists?.reduce((total, cl) => total + cl.action_items.filter(item => item.is_completed).length, 0) || 0}
          </div>
          <div className="text-sm text-gray-600">{t.hierarchy.completed}</div>
        </div>
      </div>
      {/* Subtasks Section */}
      {task.subtasks && task.subtasks.length > 0 && (
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-3">
            {t.hierarchy.subtasks} ({task.subtasks.length})
          </h4>
          <div className="space-y-2">
            {task.subtasks.map((subtask) => (
              <div key={subtask.id} className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-gray-900">{subtask.title}</h5>
                    <p className="text-sm text-gray-600">{subtask.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      subtask.status === 'done' ? 'bg-green-100 text-green-800' :
                      subtask.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {subtask.status}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      subtask.priority === 'high' ? 'bg-red-100 text-red-800' :
                      subtask.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {subtask.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Checklists Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-gray-900 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            {t.hierarchy.checklists} ({task.checklists?.length || 0})
          </h4>
          <button
            onClick={() => setIsAddingChecklist(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t.hierarchy.addChecklist}
          </button>
        </div>

        {/* Add Checklist Form */}
        {isAddingChecklist && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-3">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <h5 className="text-lg font-medium text-gray-900">{t.hierarchy.addChecklist}</h5>
            </div>
            <div className="flex space-x-3">
              <input
                type="text"
                value={newChecklistTitle}
                onChange={(e) => setNewChecklistTitle(e.target.value)}
                placeholder={t.hierarchy.checklistTitle}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateChecklist()}
                autoFocus
              />
              <button
                onClick={handleCreateChecklist}
                disabled={!newChecklistTitle.trim() || createChecklistMutation.isPending}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
              >
                {createChecklistMutation.isPending ? (
                  <>
                    <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t.common.save}
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t.common.save}
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setIsAddingChecklist(false);
                  setNewChecklistTitle('');
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                {t.common.cancel}
              </button>
            </div>
          </div>
        )}

        {/* Checklists */}
        <div className="space-y-3">
          {task.checklists?.map((checklist) => {
            const progress = calculateChecklistProgress(checklist);
            const isExpanded = expandedChecklists.has(checklist.id);

            return (
              <div key={checklist.id} className="bg-white border-2 border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                {/* Checklist Header */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3 flex-1">
                      <input
                        type="checkbox"
                        checked={checklist.is_completed}
                        onChange={(e) => handleToggleChecklist(checklist.id, e.target.checked)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-2 border-gray-300"
                      />
                      <div className="flex-1">
                        <h5 className={`font-medium text-lg ${checklist.is_completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {checklist.title}
                        </h5>
                        {checklist.description && (
                          <p className="text-sm text-gray-600 mt-1">{checklist.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <span className={`text-lg font-bold ${progress === 100 ? 'text-green-600' : 'text-blue-600'}`}>
                          {progress}%
                        </span>
                        <p className="text-xs text-gray-500">
                          {checklist.action_items.filter(item => item.is_completed).length}/{checklist.action_items.length} {t.hierarchy.completed}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleChecklist(checklist.id)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <svg
                          className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteChecklist(checklist.id)}
                        className="p-2 hover:bg-red-100 text-red-600 rounded-full transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Items */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h6 className="font-medium text-gray-700 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {t.hierarchy.actionItems} ({checklist.action_items.length})
                      </h6>
                    </div>
                    <div className="space-y-2">
                      {checklist.action_items.map((actionItem) => (
                        <div key={actionItem.id} className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                          <ActionItem
                            actionItem={actionItem}
                            onUpdate={() => {
                              queryClient.invalidateQueries({ queryKey: ['task-hierarchy', task.id] });
                              onUpdate?.();
                            }}
                          />
                        </div>
                      ))}
                      {checklist.action_items.length === 0 && (
                        <div className="text-center py-6 text-gray-500">
                          <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-sm">{t.hierarchy.noActionItems}</p>
                          <p className="text-xs text-gray-400">{t.hierarchy.noActionItemsDescription}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {(!task.checklists || task.checklists.length === 0) && !isAddingChecklist && (
          <div className="text-center py-12 bg-white border-2 border-dashed border-gray-300 rounded-lg">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t.hierarchy.noChecklists}</h3>
            <p className="text-gray-500 mb-4">{t.hierarchy.noChecklistsDescription}</p>
            <button
              onClick={() => setIsAddingChecklist(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-sm font-medium inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t.hierarchy.addChecklist}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskHierarchy;
