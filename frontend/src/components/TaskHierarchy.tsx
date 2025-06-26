import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
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
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-medium text-gray-900">
            {t.hierarchy.checklists} ({task.checklists?.length || 0})
          </h4>
          <button
            onClick={() => setIsAddingChecklist(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium"
          >
            {t.hierarchy.addChecklist}
          </button>
        </div>

        {/* Add Checklist Form */}
        {isAddingChecklist && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newChecklistTitle}
                onChange={(e) => setNewChecklistTitle(e.target.value)}
                placeholder={t.hierarchy.checklistTitle}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateChecklist()}
              />
              <button
                onClick={handleCreateChecklist}
                disabled={!newChecklistTitle.trim() || createChecklistMutation.isPending}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                {t.common.save}
              </button>
              <button
                onClick={() => {
                  setIsAddingChecklist(false);
                  setNewChecklistTitle('');
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
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
              <div key={checklist.id} className="bg-white border rounded-lg">
                {/* Checklist Header */}
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={checklist.is_completed}
                        onChange={(e) => handleToggleChecklist(checklist.id, e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <div>
                        <h5 className={`font-medium ${checklist.is_completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {checklist.title}
                        </h5>
                        {checklist.description && (
                          <p className="text-sm text-gray-600">{checklist.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {progress}% ({checklist.action_items.filter(item => item.is_completed).length}/{checklist.action_items.length})
                      </span>
                      <button
                        onClick={() => toggleChecklist(checklist.id)}
                        className="p-1 hover:bg-gray-100 rounded"
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
                        className="p-1 hover:bg-red-100 text-red-600 rounded"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Items */}
                {isExpanded && (
                  <div className="p-4">
                    <div className="space-y-2">
                      {checklist.action_items.map((actionItem) => (
                        <ActionItem
                          key={actionItem.id}
                          actionItem={actionItem}
                          onUpdate={() => {
                            queryClient.invalidateQueries({ queryKey: ['task-hierarchy', task.id] });
                            onUpdate?.();
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {(!task.checklists || task.checklists.length === 0) && !isAddingChecklist && (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <p>{t.hierarchy.noChecklists}</p>
            <p className="text-sm">{t.hierarchy.noChecklistsDescription}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskHierarchy;
