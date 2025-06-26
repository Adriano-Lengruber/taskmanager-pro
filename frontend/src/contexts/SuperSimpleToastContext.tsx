import React, { createContext, useContext, useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface SimpleToast {
  id: string;
  message: string;
  type: ToastType;
  createdAt: number;
}

interface SimpleToastContextType {
  showToast: (message: string, type: ToastType, duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
}

const SimpleToastContext = createContext<SimpleToastContextType | undefined>(undefined);

export function SimpleToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<SimpleToast[]>([]);

  const removeToast = useCallback((id: string) => {
    console.log(`SimpleToast: Removing toast ${id}`);
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType, duration?: number) => {
    // Verificar duplicatas baseado em tempo (últimos 1 segundo)
    const now = Date.now();
    const recentToast = toasts.find(toast => 
      toast.message === message && 
      toast.type === type && 
      (now - toast.createdAt) < 1000
    );
    
    if (recentToast) {
      console.log(`SimpleToast: Duplicate prevented: "${message}"`);
      return;
    }

    const id = `toast_${now}_${Math.random().toString(36).substr(2, 4)}`;
    
    // Duração padrão
    const finalDuration = duration || (type === 'error' ? 8000 : type === 'success' ? 4000 : 5000);
    
    console.log(`SimpleToast: Showing ${type}: "${message}" (${finalDuration}ms)`);
    
    const newToast: SimpleToast = {
      id,
      message,
      type,
      createdAt: now
    };

    // Adicionar toast
    setToasts(prev => [...prev, newToast]);

    // Remover após duração
    setTimeout(() => {
      removeToast(id);
    }, finalDuration);
  }, [toasts, removeToast]);

  const showSuccess = useCallback((message: string, duration?: number) => {
    showToast(message, 'success', duration);
  }, [showToast]);

  const showError = useCallback((message: string, duration?: number) => {
    showToast(message, 'error', duration);
  }, [showToast]);

  const showWarning = useCallback((message: string, duration?: number) => {
    showToast(message, 'warning', duration);
  }, [showToast]);

  const showInfo = useCallback((message: string, duration?: number) => {
    showToast(message, 'info', duration);
  }, [showToast]);

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return (
          <div className="w-5 h-5 text-green-600">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="w-5 h-5 text-red-600">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="w-5 h-5 text-yellow-600">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'info':
        return (
          <div className="w-5 h-5 text-blue-600">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getToastColor = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'border-green-500 text-green-800 bg-green-50';
      case 'error':
        return 'border-red-500 text-red-800 bg-red-50';
      case 'warning':
        return 'border-yellow-500 text-yellow-800 bg-yellow-50';
      case 'info':
        return 'border-blue-500 text-blue-800 bg-blue-50';
      default:
        return 'border-gray-500 text-gray-800 bg-gray-50';
    }
  };

  return (
    <SimpleToastContext.Provider value={{
      showToast,
      showSuccess,
      showError,
      showWarning,
      showInfo
    }}>
      {children}
      
      {/* Container de toasts - mais simples */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              max-w-sm w-full p-4 rounded-lg border-l-4 shadow-lg
              ${getToastColor(toast.type)}
              animate-in slide-in-from-right duration-300
            `}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {getToastIcon(toast.type)}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </SimpleToastContext.Provider>
  );
}

export function useSimpleToast() {
  const context = useContext(SimpleToastContext);
  if (context === undefined) {
    throw new Error('useSimpleToast must be used within a SimpleToastProvider');
  }
  return context;
}
