// Toast global que renderiza FORA do React
let currentToast: HTMLElement | null = null;
let currentTimeout: number | null = null;

interface ToastOptions {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export const globalToast = {
  show: ({ message, type, duration = 5000 }: ToastOptions) => {
    console.log(`🌍 GLOBAL TOAST: ${type} - "${message}"`);
    
    // Limpar toast anterior
    if (currentToast) {
      document.body.removeChild(currentToast);
      currentToast = null;
    }
    
    // Limpar timeout anterior
    if (currentTimeout) {
      clearTimeout(currentTimeout);
      currentTimeout = null;
    }
    
    // Criar elemento DOM diretamente
    const toastElement = document.createElement('div');
    toastElement.style.cssText = `
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 999999;
      max-width: 400px;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.4;
      pointer-events: auto;
      transform: translateX(0);
      transition: none !important;
      animation: none !important;
    `;
    
    // Definir cores baseadas no tipo
    switch (type) {
      case 'success':
        toastElement.style.backgroundColor = '#059669';
        toastElement.style.color = 'white';
        toastElement.style.borderLeft = '4px solid #10b981';
        break;
      case 'error':
        toastElement.style.backgroundColor = '#dc2626';
        toastElement.style.color = 'white';
        toastElement.style.borderLeft = '4px solid #ef4444';
        break;
      case 'warning':
        toastElement.style.backgroundColor = '#eab308';
        toastElement.style.color = 'black';
        toastElement.style.borderLeft = '4px solid #facc15';
        break;
      case 'info':
        toastElement.style.backgroundColor = '#2563eb';
        toastElement.style.color = 'white';
        toastElement.style.borderLeft = '4px solid #3b82f6';
        break;
    }
    
    // Criar conteúdo
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';
    toastElement.innerHTML = `
      <div style="display: flex; align-items: flex-start; gap: 12px;">
        <span style="font-size: 18px; flex-shrink: 0; margin-top: 1px;">${icon}</span>
        <div style="flex: 1; min-width: 0;">
          <p style="margin: 0; white-space: pre-wrap; word-break: break-word;">${message}</p>
        </div>
      </div>
    `;
    
    // Adicionar ao DOM
    document.body.appendChild(toastElement);
    currentToast = toastElement;
    
    console.log(`🌍 Toast adicionado ao DOM, removendo em ${duration}ms`);
    
    // Agendar remoção
    currentTimeout = window.setTimeout(() => {
      if (currentToast === toastElement && document.body.contains(toastElement)) {
        document.body.removeChild(toastElement);
        console.log('🌍 Toast removido do DOM');
      }
      currentToast = null;
      currentTimeout = null;
    }, duration);
  },
  
  success: (message: string, duration?: number) => 
    globalToast.show({ message, type: 'success', duration }),
  
  error: (message: string, duration?: number) => 
    globalToast.show({ message, type: 'error', duration: duration || 8000 }),
  
  warning: (message: string, duration?: number) => 
    globalToast.show({ message, type: 'warning', duration }),
  
  info: (message: string, duration?: number) => 
    globalToast.show({ message, type: 'info', duration }),
  
  clear: () => {
    if (currentToast) {
      document.body.removeChild(currentToast);
      currentToast = null;
    }
    if (currentTimeout) {
      clearTimeout(currentTimeout);
      currentTimeout = null;
    }
    console.log('🌍 Toast limpo manualmente');
  }
};

// Hook opcional para usar o toast global no React
export const useGlobalToast = () => globalToast;
