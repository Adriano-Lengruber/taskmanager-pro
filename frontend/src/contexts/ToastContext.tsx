import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast } from '../components/Toast';
import type { ToastType } from '../components/Toast';

interface ToastNotification {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType, duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType, duration?: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    
    // Duração padrão baseada no tipo
    let defaultDuration = 5000; // 5 segundos padrão
    if (type === 'error') {
      defaultDuration = 8000; // 8 segundos para erros
    } else if (type === 'success') {
      defaultDuration = 4000; // 4 segundos para sucessos
    }
    
    const newToast: ToastNotification = {
      id,
      message,
      type,
      duration: duration !== undefined ? duration : defaultDuration
    };

    console.log(`Toast: [${type.toUpperCase()}] ${message} - Duration: ${newToast.duration}ms`);
    
    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    if (newToast.duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  }, [removeToast]);

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

  const value: ToastContextType = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Render toasts */}
      <div className="fixed top-4 right-4 z-[9999] space-y-3">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            className="transform transition-all duration-500 ease-in-out"
            style={{ 
              transform: `translateY(${index * 80}px)`,
              zIndex: 9999 - index 
            }}
          >
            <Toast
              message={toast.message}
              type={toast.type}
              isVisible={true}
              onClose={() => removeToast(toast.id)}
              duration={0} // Controlled by the provider
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
