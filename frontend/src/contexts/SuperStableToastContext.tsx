import React, { createContext, useContext, useState, useRef } from 'react';

interface ToastContextType {
  showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info', duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
}

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function SuperStableToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info', duration: number = 5000) => {
    console.log(`🔥 SUPER STABLE TOAST: ${type} - "${message}"`);
    
    // Limpar qualquer timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Mostrar toast IMEDIATAMENTE
    setToast({ message, type });

    // Remover toast após duração
    timeoutRef.current = window.setTimeout(() => {
      console.log(`🗑️ REMOVING TOAST: "${message}"`);
      setToast(null);
    }, duration);
  };

  const showSuccess = (message: string, duration?: number) => showToast(message, 'success', duration);
  const showError = (message: string, duration?: number) => showToast(message, 'error', duration || 8000);
  const showWarning = (message: string, duration?: number) => showToast(message, 'warning', duration);
  const showInfo = (message: string, duration?: number) => showToast(message, 'info', duration);

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, showWarning, showInfo }}>
      {children}
      {toast && (
        <div 
          className={`
            fixed top-4 right-4 p-4 rounded-lg shadow-xl z-[9999] max-w-md
            ${toast.type === 'success' ? 'bg-green-600 text-white' : ''}
            ${toast.type === 'error' ? 'bg-red-600 text-white' : ''}
            ${toast.type === 'warning' ? 'bg-yellow-500 text-black' : ''}
            ${toast.type === 'info' ? 'bg-blue-600 text-white' : ''}
            border-2 border-opacity-50
            ${toast.type === 'success' ? 'border-green-400' : ''}
            ${toast.type === 'error' ? 'border-red-400' : ''}
            ${toast.type === 'warning' ? 'border-yellow-300' : ''}
            ${toast.type === 'info' ? 'border-blue-400' : ''}
          `}
          style={{ 
            fontWeight: 'bold',
            fontSize: '14px',
            lineHeight: '1.4'
          }}
        >
          <div className="flex items-center space-x-2">
            <span className="text-lg">
              {toast.type === 'success' && '✅'}
              {toast.type === 'error' && '❌'}
              {toast.type === 'warning' && '⚠️'}
              {toast.type === 'info' && 'ℹ️'}
            </span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a SuperStableToastProvider');
  }
  return context;
}
