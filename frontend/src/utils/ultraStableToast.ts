// Ultra Stable Toast - Completamente isolado do React, immune a re-renders
// Toast que funciona fora do DOM do React para máxima estabilidade

interface ToastConfig {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose?: () => void;
}

class UltraStableToast {
  private toastCounter = 0;
  private activeToasts = new Map<string, HTMLElement>();
  private toastContainer: HTMLElement | null = null;

  constructor() {
    this.ensureContainer();
  }

  private ensureContainer() {
    if (!this.toastContainer || !document.body.contains(this.toastContainer)) {
      // Remove container antigo se existir
      const oldContainer = document.getElementById('ultra-stable-toast-container');
      if (oldContainer) {
        oldContainer.remove();
      }

      // Criar novo container completamente isolado
      this.toastContainer = document.createElement('div');
      this.toastContainer.id = 'ultra-stable-toast-container';
      this.toastContainer.style.cssText = `
        position: fixed !important;
        top: 20px !important;
        right: 20px !important;
        z-index: 999999 !important;
        pointer-events: none !important;
        max-width: 400px !important;
        min-width: 300px !important;
      `;

      // Adicionar ao body como último elemento
      document.body.appendChild(this.toastContainer);
    }
  }

  private createToast(config: ToastConfig): string {
    this.ensureContainer();
    
    const toastId = `ultra-toast-${++this.toastCounter}-${Date.now()}`;
    
    // Cores para cada tipo
    const colors = {
      success: { bg: '#10b981', text: '#ffffff' },
      error: { bg: '#ef4444', text: '#ffffff' },
      warning: { bg: '#f59e0b', text: '#ffffff' },
      info: { bg: '#3b82f6', text: '#ffffff' }
    };

    const color = colors[config.type];

    // Criar elemento do toast
    const toastElement = document.createElement('div');
    toastElement.id = toastId;
    toastElement.style.cssText = `
      background: ${color.bg} !important;
      color: ${color.text} !important;
      padding: 16px 20px !important;
      border-radius: 8px !important;
      box-shadow: 0 8px 25px rgba(0,0,0,0.25) !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif !important;
      font-size: 14px !important;
      font-weight: 500 !important;
      line-height: 1.4 !important;
      max-width: 400px !important;
      word-wrap: break-word !important;
      border-left: 4px solid ${this.getBorderColor(config.type)} !important;
      pointer-events: auto !important;
      margin-bottom: 8px !important;
      position: relative !important;
      transform: none !important;
      transition: none !important;
      animation: none !important;
      opacity: 1 !important;
      visibility: visible !important;
      display: block !important;
    `;

    // Conteúdo com ícone e proteção contra XSS
    const icon = this.getIcon(config.type);
    const safeMessage = this.escapeHtml(config.message);
    
    toastElement.innerHTML = `
      <div style="display: flex !important; align-items: flex-start !important; gap: 10px !important;">
        <span style="font-size: 16px !important; line-height: 1 !important; flex-shrink: 0 !important;">${icon}</span>
        <span style="flex: 1 !important;">${safeMessage}</span>
      </div>
    `;

    // Adicionar ao container
    this.toastContainer!.appendChild(toastElement);
    this.activeToasts.set(toastId, toastElement);

    // Log para debug
    console.log(`🔥 UltraStableToast: Toast ${toastId} adicionado ao DOM`);

    // Configurar remoção automática
    const duration = config.duration || (config.type === 'error' ? 8000 : 4000);
    const removeTimer = setTimeout(() => {
      this.removeToast(toastId);
    }, duration);

    // Adicionar evento de clique para fechar
    toastElement.addEventListener('click', () => {
      clearTimeout(removeTimer);
      this.removeToast(toastId);
    });

    // Log para debug
    console.log(`🔥 UltraStableToast: Created ${config.type} toast with ID ${toastId}, duration ${duration}ms`);

    return toastId;
  }

  private removeToast(toastId: string) {
    const toastElement = this.activeToasts.get(toastId);
    if (!toastElement) {
      console.log(`🔥 UltraStableToast: Toast ${toastId} already removed or doesn't exist`);
      return;
    }

    console.log(`🔥 UltraStableToast: Removing toast ${toastId}`);

    // Animar saída
    toastElement.style.transform = 'translateX(100%) !important';
    toastElement.style.opacity = '0 !important';

    setTimeout(() => {
      try {
        if (toastElement.parentNode) {
          toastElement.parentNode.removeChild(toastElement);
        }
        this.activeToasts.delete(toastId);
        console.log(`🔥 UltraStableToast: Toast ${toastId} removed from DOM`);
      } catch (error) {
        console.error(`🔥 UltraStableToast: Error removing toast ${toastId}:`, error);
      }
    }, 300);
  }

  public success(message: string, duration?: number) {
    return this.createToast({ message, type: 'success', duration });
  }

  public error(message: string, duration?: number) {
    return this.createToast({ message, type: 'error', duration });
  }

  public warning(message: string, duration?: number) {
    return this.createToast({ message, type: 'warning', duration });
  }

  public info(message: string, duration?: number) {
    return this.createToast({ message, type: 'info', duration });
  }

  public clear() {
    console.log('🔥 UltraStableToast: Clearing all toasts');
    this.activeToasts.forEach((_, toastId) => {
      this.removeToast(toastId);
    });
  }

  private getBorderColor(type: string): string {
    switch (type) {
      case 'success': return '#059669';
      case 'error': return '#dc2626';
      case 'warning': return '#d97706';
      case 'info': return '#2563eb';
      default: return '#4b5563';
    }
  }

  private getIcon(type: string): string {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  public destroy() {
    console.log('🔥 UltraStableToast: Destroying toast system');
    this.clear();
    if (this.toastContainer && this.toastContainer.parentNode) {
      this.toastContainer.parentNode.removeChild(this.toastContainer);
      this.toastContainer = null;
    }
  }
}

// Instância global singleton
export const ultraStableToast = new UltraStableToast();

// Cleanup quando a página é fechada
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    ultraStableToast.destroy();
  });
}
