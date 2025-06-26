import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { hierarchyService } from '../services/hierarchy';
import type { ChecklistWithItems, ActionItemCreate } from '../types/api';
import ActionItemComponent from './ActionItem';

interface ChecklistProps {
  checklist: ChecklistWithItems;
  onUpdate?: () => void;
}

export const ChecklistComponent: React.FC<ChecklistProps> = ({
  checklist,
  onUpdate
}) => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingActionItem, setIsAddingActionItem] = useState(false);
  const [newActionItem, setNewActionItem] = useState<ActionItemCreate>({
    title: '',
    description: '',
    checklist_id: checklist.id,
    priority: 'medium',
    order_index: 0
  });

  // Toggle checklist completion
  const toggleCompletionMutation = useMutation({
    mutationFn: (completed: boolean) => 
      hierarchyService.toggleChecklistCompletion(checklist.id, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-hierarchy'] });
      queryClient.invalidateQueries({ queryKey: ['task-checklists'] });
      showToast(
        checklist.is_completed 
          ? t.hierarchy.checklistMarkedIncomplete 
          : t.hierarchy.checklistMarkedComplete, 
        'success'
      );
      onUpdate?.();
    },
    onError: (error) => {
      console.error('Error toggling checklist completion:', error);
      showToast(t.hierarchy.toggleChecklistError, 'error');
    }
  });

  // Create action item
  const createActionItemMutation = useMutation({
    mutationFn: (actionItem: ActionItemCreate) =>
      hierarchyService.createActionItem(checklist.id, actionItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-hierarchy'] });
      queryClient.invalidateQueries({ queryKey: ['task-checklists'] });
      setNewActionItem({
        title: '',
        description: '',
        checklist_id: checklist.id,
        priority: 'medium',
        order_index: 0
      });
      setIsAddingActionItem(false);
      showToast(t.hierarchy.actionItemCreated, 'success');
      onUpdate?.();
    },
    onError: (error) => {
      console.error('Error creating action item:', error);
      showToast(t.hierarchy.createActionItemError, 'error');
    }
  });

  const handleToggleCompletion = () => {
    toggleCompletionMutation.mutate(!checklist.is_completed);
  };

  const handleCreateActionItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionItem.title.trim()) {
      showToast(t.hierarchy.actionItemTitleRequired, 'error');
      return;
    }
    createActionItemMutation.mutate(newActionItem);
  };

  const completedItems = checklist.action_items.filter(item => item.is_completed).length;
  const totalItems = checklist.action_items.length;
  const completionPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
      {/* Checklist Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleToggleCompletion}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
              checklist.is_completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-green-400'
            }`}
            disabled={toggleCompletionMutation.isPending}
          >
            {checklist.is_completed && (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          
          <div className="flex-1">
            <h4 className={`font-medium ${checklist.is_completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {checklist.title}
            </h4>
            {checklist.description && (
              <p className="text-sm text-gray-600 mt-1">{checklist.description}</p>
            )}
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">
                {completedItems}/{totalItems} {t.hierarchy.completed}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsAddingActionItem(!isAddingActionItem)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          + {t.hierarchy.addActionItem}
        </button>
      </div>

      {/* Action Items */}
      <div className="space-y-2 ml-8">
        {checklist.action_items.map((actionItem) => (
          <ActionItemComponent
            key={actionItem.id}
            actionItem={actionItem}
            onUpdate={onUpdate}
          />
        ))}

        {/* Add Action Item Form */}
        {isAddingActionItem && (
          <form onSubmit={handleCreateActionItem} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
            <div className="space-y-3">
              <input
                type="text"
                placeholder={t.hierarchy.actionItemTitle}
                value={newActionItem.title}
                onChange={(e) => setNewActionItem({ ...newActionItem, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              
              <textarea
                placeholder={t.hierarchy.actionItemDescription}
                value={newActionItem.description}
                onChange={(e) => setNewActionItem({ ...newActionItem, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />

              <div className="flex items-center space-x-3">
                <select
                  value={newActionItem.priority}
                  onChange={(e) => setNewActionItem({ ...newActionItem, priority: e.target.value as any })}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">{t.tasks.low}</option>
                  <option value="medium">{t.tasks.medium}</option>
                  <option value="high">{t.tasks.high}</option>
                  <option value="urgent">{t.dashboard.urgent}</option>
                </select>

                <input
                  type="date"
                  value={newActionItem.due_date?.split('T')[0] || ''}
                  onChange={(e) => setNewActionItem({ 
                    ...newActionItem, 
                    due_date: e.target.value ? new Date(e.target.value).toISOString() : undefined 
                  })}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="submit"
                  disabled={createActionItemMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {createActionItemMutation.isPending ? t.common.loading : t.common.create}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingActionItem(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  {t.common.cancel}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChecklistComponent;
