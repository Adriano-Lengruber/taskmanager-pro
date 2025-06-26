import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast } from '../components/Toast';
import type { ToastType } from '../components/Toast';

interface ToastNotification {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  timestamp: number;
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
    console.log(`🗑️ REMOVE TOAST CALLED: ${id}`);
    setToasts(prev => {
      const newToasts = prev.filter(toast => toast.id !== id);
      console.log(`🗑️ TOASTS AFTER REMOVAL: ${newToasts.length}`);
      return newToasts;
    });
  }, []);

  const showToast = useCallback((message: string, type: ToastType, duration?: number) => {
    console.log(`🔥 TOAST CALL: ${type} - "${message}"`);
    
    const id = Math.random().toString(36).substr(2, 9);
    
    // Duração padrão baseada no tipo
    let finalDuration = duration;
    if (!finalDuration) {
      switch (type) {
        case 'error':
          finalDuration = 8000; // 8 segundos para erros
          break;
        case 'success':
          finalDuration = 4000; // 4 segundos para sucessos
          break;
        case 'warning':
          finalDuration = 6000; // 6 segundos para avisos
          break;
        default:
          finalDuration = 5000; // 5 segundos padrão
      }
    }
    
    const newToast: ToastNotification = {
      id,
      message,
      type,
      duration: finalDuration,
      timestamp: Date.now()
    };

    console.log(`🔥 CREATING TOAST: ${id} - Duration: ${finalDuration}ms`);
    
    // Adicionar o toast
    setToasts(prev => {
      // Evitar toasts duplicados nos últimos 1 segundo (mais agressivo)
      const now = Date.now();
      const exists = prev.find(t => 
        t.message === message && 
        t.type === type && 
        (now - t.timestamp) < 1000
      );
      if (exists) {
        console.log('🚫 DUPLICATE PREVENTED');
        return prev;
      }
      console.log(`🔥 ADDING TOAST: ${id}`);
      return [...prev, newToast];
    });

    // Programar remoção
    setTimeout(() => {
      console.log(`🗑️ REMOVING TOAST: ${id} after ${finalDuration}ms`);
      removeToast(id);
    }, finalDuration);
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
      {/* Render toasts - versão ultra simplificada */}
      <div className="fixed top-4 right-4 z-[9999] space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
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
