import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

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

export function UltraStableToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const toastIdRef = useRef<number>(0);

  // Usar useCallback para evitar re-criação das funções
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info', duration: number = 5000) => {
    console.log(`🔥 ULTRA STABLE TOAST: ${type} - "${message}" (${duration}ms)`);
    
    // Limpar timeout anterior de forma mais robusta
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      console.log('🧹 Timeout anterior limpo');
    }

    // Incrementar ID para garantir re-render
    toastIdRef.current += 1;
    const newToastId = toastIdRef.current;

    // Mostrar toast IMEDIATAMENTE (render síncrono)
    const newToast = {
      message,
      type,
      id: newToastId
    };

    console.log(`📤 Definindo toast com ID ${newToastId}`);
    setToast(newToast);

    // Agendar remoção com timeout mais robusto
    timeoutRef.current = window.setTimeout(() => {
      console.log(`🗑️ Removendo toast ID ${newToastId}: "${message}"`);
      setToast(prev => {
        // Só remover se for o mesmo toast (evitar conflitos)
        if (prev && prev.id === newToastId) {
          console.log(`✅ Toast ${newToastId} removido com sucesso`);
          return null;
        } else {
          console.log(`⚠️ Toast ${newToastId} não removido (outro toast ativo)`);
          return prev;
        }
      });
      timeoutRef.current = null;
    }, duration);

    console.log(`⏰ Timeout agendado para ${duration}ms (ID: ${timeoutRef.current})`);
  }, []);

  const showSuccess = useCallback((message: string, duration?: number) => 
    showToast(message, 'success', duration), [showToast]);
  
  const showError = useCallback((message: string, duration?: number) => 
    showToast(message, 'error', duration || 8000), [showToast]);
  
  const showWarning = useCallback((message: string, duration?: number) => 
    showToast(message, 'warning', duration), [showToast]);
  
  const showInfo = useCallback((message: string, duration?: number) => 
    showToast(message, 'info', duration), [showToast]);

  // Memoizar o contexto para evitar re-renders desnecessários
  const contextValue = React.useMemo(() => ({
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }), [showToast, showSuccess, showError, showWarning, showInfo]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {toast && (
        <div 
          key={`toast-${toast.id}`} // Key único para forçar re-render limpo
          className={`
            fixed top-4 right-4 p-4 rounded-lg shadow-2xl z-[99999] max-w-md
            font-bold text-sm leading-5
            ${toast.type === 'success' ? 'bg-green-600 text-white border-l-4 border-green-400' : ''}
            ${toast.type === 'error' ? 'bg-red-600 text-white border-l-4 border-red-400' : ''}
            ${toast.type === 'warning' ? 'bg-yellow-500 text-black border-l-4 border-yellow-300' : ''}
            ${toast.type === 'info' ? 'bg-blue-600 text-white border-l-4 border-blue-400' : ''}
            transform-gpu
          `}
          style={{ 
            // Estilos inline para máxima estabilidade
            position: 'fixed',
            top: '16px',
            right: '16px',
            zIndex: 99999,
            pointerEvents: 'auto',
            willChange: 'auto' // Evitar otimizações de GPU que podem causar piscar
          }}
        >
          <div className="flex items-start space-x-3">
            <span className="text-lg flex-shrink-0 mt-0.5">
              {toast.type === 'success' && '✅'}
              {toast.type === 'error' && '❌'}
              {toast.type === 'warning' && '⚠️'}
              {toast.type === 'info' && 'ℹ️'}
            </span>
            <div className="flex-1 min-w-0">
              <p className="whitespace-pre-wrap break-words">{toast.message}</p>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within an UltraStableToastProvider');
  }
  return context;
}
