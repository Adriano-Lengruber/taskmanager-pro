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
  id: number;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function UltraSimpleToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info', duration: number = 5000) => {
    console.log(`🔥 SIMPLE TOAST: ${type} - "${message}"`);
    
    // Limpar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Mostrar toast imediatamente (sem animação complexa)
    const newToast = {
      message,
      type,
      id: Date.now()
    };

    setToast(newToast);

    // Remover após duração especificada
    timeoutRef.current = window.setTimeout(() => {
      console.log(`🗑️ REMOVING TOAST: "${message}"`);
      setToast(null);
      timeoutRef.current = null;
    }, duration);
  };

  const showSuccess = (message: string, duration?: number) => showToast(message, 'success', duration);
  const showError = (message: string, duration?: number) => showToast(message, 'error', duration || 8000);
  const showWarning = (message: string, duration?: number) => showToast(message, 'warning', duration);
  const showInfo = (message: string, duration?: number) => showToast(message, 'info', duration);

  const getToastStyles = (type: string) => {
    const baseStyles = "fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-md font-medium";
    const typeStyles = {
      success: "bg-green-500 text-white border-l-4 border-green-700",
      error: "bg-red-500 text-white border-l-4 border-red-700",
      warning: "bg-yellow-500 text-black border-l-4 border-yellow-700",
      info: "bg-blue-500 text-white border-l-4 border-blue-700"
    };
    return `${baseStyles} ${typeStyles[type as keyof typeof typeStyles] || typeStyles.info}`;
  };

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, showWarning, showInfo }}>
      {children}
      {toast && (
        <div
          key={toast.id}
          className={`${getToastStyles(toast.type)} animate-pulse`}
        >
          <div className="flex items-center">
            {toast.type === 'success' && <span className="mr-2">✅</span>}
            {toast.type === 'error' && <span className="mr-2">❌</span>}
            {toast.type === 'warning' && <span className="mr-2">⚠️</span>}
            {toast.type === 'info' && <span className="mr-2">ℹ️</span>}
            {toast.message}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within an UltraSimpleToastProvider');
  }
  return context;
}
