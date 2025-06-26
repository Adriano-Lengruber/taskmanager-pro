import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { hierarchyService } from '../services/hierarchy';
import type { ActionItem, ActionItemUpdate } from '../types/api';

interface ActionItemProps {
  actionItem: ActionItem;
  onUpdate?: () => void;
}

export const ActionItemComponent: React.FC<ActionItemProps> = ({
  actionItem,
  onUpdate
}) => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<ActionItemUpdate>({
    title: actionItem.title,
    description: actionItem.description,
    priority: actionItem.priority,
    due_date: actionItem.due_date
  });

  // Toggle completion
  const toggleCompletionMutation = useMutation({
    mutationFn: (completed: boolean) => 
      hierarchyService.toggleActionItemCompletion(actionItem.id, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-hierarchy'] });
      queryClient.invalidateQueries({ queryKey: ['task-checklists'] });
      onUpdate?.();
    },
    onError: (error) => {
      console.error('Error toggling action item completion:', error);
      showToast(t.common.error, 'error');
    }
  });

  // Update action item
  const updateMutation = useMutation({
    mutationFn: (update: ActionItemUpdate) =>
      hierarchyService.updateActionItem(actionItem.id, update),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-hierarchy'] });
      queryClient.invalidateQueries({ queryKey: ['task-checklists'] });
      setIsEditing(false);
      showToast(t.tasks.taskUpdated, 'success');
      onUpdate?.();
    },
    onError: (error) => {
      console.error('Error updating action item:', error);
      showToast(t.common.error, 'error');
    }
  });

  // Delete action item
  const deleteMutation = useMutation({
    mutationFn: () => hierarchyService.deleteActionItem(actionItem.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-hierarchy'] });
      queryClient.invalidateQueries({ queryKey: ['task-checklists'] });
      showToast(t.tasks.taskDeleted, 'success');
      onUpdate?.();
    },
    onError: (error) => {
      console.error('Error deleting action item:', error);
      showToast(t.common.error, 'error');
    }
  });

  const handleToggleCompletion = () => {
    toggleCompletionMutation.mutate(!actionItem.is_completed);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData.title?.trim()) {
      showToast(t.tasks.taskTitle + ' ' + t.auth.fieldRequired, 'error');
      return;
    }
    updateMutation.mutate(editData);
  };

  const handleDelete = () => {
    if (window.confirm(t.tasks.deleteTask + '?')) {
      deleteMutation.mutate();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'low': return t.tasks.low;
      case 'medium': return t.tasks.medium;
      case 'high': return t.tasks.high;
      case 'urgent': return t.dashboard.urgent;
      default: return priority;
    }
  };

  const isOverdue = actionItem.due_date && new Date(actionItem.due_date) < new Date() && !actionItem.is_completed;

  if (isEditing) {
    return (
      <form onSubmit={handleUpdate} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
        <div className="space-y-3">
          <input
            type="text"
            value={editData.title || ''}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t.tasks.taskTitle}
            autoFocus
          />
          
          <textarea
            value={editData.description || ''}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t.tasks.taskDescription}
            rows={2}
          />

          <div className="flex items-center space-x-3">
            <select
              value={editData.priority || 'medium'}
              onChange={(e) => setEditData({ ...editData, priority: e.target.value as any })}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">{t.tasks.low}</option>
              <option value="medium">{t.tasks.medium}</option>
              <option value="high">{t.tasks.high}</option>
              <option value="urgent">{t.dashboard.urgent}</option>
            </select>

            <input
              type="date"
              value={editData.due_date?.split('T')[0] || ''}
              onChange={(e) => setEditData({ 
                ...editData, 
                due_date: e.target.value ? new Date(e.target.value).toISOString() : undefined 
              })}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {updateMutation.isPending ? t.common.loading : t.common.save}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              {t.common.cancel}
            </button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <div className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 group ${
      actionItem.is_completed ? 'opacity-75' : ''
    }`}>
      {/* Completion checkbox */}
      <button
        onClick={handleToggleCompletion}
        className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
          actionItem.is_completed
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-gray-300 hover:border-green-400'
        }`}
        disabled={toggleCompletionMutation.isPending}
      >
        {actionItem.is_completed && (
          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-medium ${
            actionItem.is_completed ? 'line-through text-gray-500' : 'text-gray-900'
          }`}>
            {actionItem.title}
          </span>
          
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(actionItem.priority)}`}>
            {getPriorityLabel(actionItem.priority)}
          </span>

          {actionItem.due_date && (
            <span className={`text-xs ${
              isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'
            }`}>
              {new Date(actionItem.due_date).toLocaleDateString()}
            </span>
          )}
        </div>
        
        {actionItem.description && (
          <p className="text-xs text-gray-600 mt-1">{actionItem.description}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setIsEditing(true)}
          className="p-1 text-gray-400 hover:text-blue-600 rounded"
          title={t.common.edit}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        
        <button
          onClick={handleDelete}
          className="p-1 text-gray-400 hover:text-red-600 rounded"
          title={t.common.delete}
          disabled={deleteMutation.isPending}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ActionItemComponent;
