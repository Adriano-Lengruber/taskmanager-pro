import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastData {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
  isVisible: boolean;
  createdAt: number;
}

interface ImprovedToastContextType {
  showToast: (message: string, type: ToastType, duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ImprovedToastContext = createContext<ImprovedToastContextType | undefined>(undefined);

export function ImprovedToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const timeoutRefs = useRef<{ [key: string]: number }>({});

  const removeToast = useCallback((id: string) => {
    console.log(`ImprovedToast: Removing toast ${id}`);
    
    // Limpar timeout se existir
    if (timeoutRefs.current[id]) {
      clearTimeout(timeoutRefs.current[id]);
      delete timeoutRefs.current[id];
    }
    
    // Primeiro, marcar como não visível para animação de saída
    setToasts(prev => prev.map(toast => 
      toast.id === id ? { ...toast, isVisible: false } : toast
    ));
    
    // Depois de um tempo para a animação, remover completamente
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 300); // Tempo da animação
  }, []);

  const showToast = useCallback((message: string, type: ToastType, duration?: number) => {
    // Verificar se já existe um toast igual recente (últimos 2 segundos)
    const now = Date.now();
    const existingToast = toasts.find(toast => 
      toast.message === message && 
      toast.type === type && 
      (now - toast.createdAt) < 2000
    );
    
    if (existingToast) {
      console.log(`ImprovedToast: Duplicate toast prevented: "${message}"`);
      return;
    }

    // Duração padrão baseada no tipo
    let finalDuration = duration;
    if (finalDuration === undefined) {
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
        case 'info':
          finalDuration = 5000; // 5 segundos para info
          break;
        default:
          finalDuration = 5000;
      }
    }

    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    
    console.log(`ImprovedToast: Showing ${type} toast: "${message}" for ${finalDuration}ms`);
    
    const newToast: ToastData = {
      id,
      message,
      type,
      duration: finalDuration,
      isVisible: true,
      createdAt: now
    };

    // Adicionar o toast
    setToasts(prev => [...prev, newToast]);

    // Programar remoção automática
    timeoutRefs.current[id] = setTimeout(() => {
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

  // Componente Toast inline para melhor controle
  const ToastComponent = ({ toast, index }: { toast: ToastData; index: number }) => {
    const getToastStyles = () => {
      const baseClasses = "max-w-sm w-full bg-white shadow-lg rounded-lg border-l-4 p-4 transform transition-all duration-300 ease-in-out";
      
      const visibilityClasses = toast.isVisible 
        ? "translate-x-0 opacity-100 scale-100" 
        : "translate-x-full opacity-0 scale-95";
      
      let borderColor = "";
      switch (toast.type) {
        case 'success':
          borderColor = "border-green-500";
          break;
        case 'error':
          borderColor = "border-red-500";
          break;
        case 'warning':
          borderColor = "border-yellow-500";
          break;
        case 'info':
          borderColor = "border-blue-500";
          break;
        default:
          borderColor = "border-gray-500";
      }
      
      return `${baseClasses} ${visibilityClasses} ${borderColor}`;
    };

    const getIcon = () => {
      const iconClasses = "w-5 h-5";
      
      switch (toast.type) {
        case 'success':
          return (
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                <svg className={`${iconClasses} text-green-600`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          );
        case 'error':
          return (
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
                <svg className={`${iconClasses} text-red-600`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          );
        case 'warning':
          return (
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-full">
                <svg className={`${iconClasses} text-yellow-600`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          );
        case 'info':
          return (
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                <svg className={`${iconClasses} text-blue-600`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          );
        default:
          return null;
      }
    };

    const getTextColor = () => {
      switch (toast.type) {
        case 'success': return 'text-green-800';
        case 'error': return 'text-red-800';
        case 'warning': return 'text-yellow-800';
        case 'info': return 'text-blue-800';
        default: return 'text-gray-800';
      }
    };

    return (
      <div 
        className={getToastStyles()}
        style={{
          marginBottom: '8px',
          zIndex: 9999 - index
        }}
      >
        <div className="flex items-start">
          {getIcon()}
          <div className="flex-1 min-w-0 ml-3">
            <p className={`text-sm font-medium ${getTextColor()}`}>
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-150"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  return (
    <ImprovedToastContext.Provider value={{
      showToast,
      showSuccess,
      showError,
      showWarning,
      showInfo,
      removeToast
    }}>
      {children}
      
      {/* Toast Container - posicionamento fixo no canto superior direito */}
      <div className="fixed top-4 right-4 z-[9999] pointer-events-none">
        <div className="space-y-2 pointer-events-auto">
          {toasts.map((toast, index) => (
            <ToastComponent 
              key={toast.id} 
              toast={toast} 
              index={index}
            />
          ))}
        </div>
      </div>
    </ImprovedToastContext.Provider>
  );
}

export function useImprovedToast() {
  const context = useContext(ImprovedToastContext);
  if (context === undefined) {
    throw new Error('useImprovedToast must be used within an ImprovedToastProvider');
  }
  return context;
}
