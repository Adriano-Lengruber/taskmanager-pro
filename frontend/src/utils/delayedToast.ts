// Toast com delay para evitar conflitos com re-renders
class DelayedToastManager {
  private container: HTMLElement | null = null;
  private currentToast: HTMLElement | null = null;
  private removeTimer: number | null = null;
  private showTimer: number | null = null;
  private toastQueue: Array<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration: number;
    timestamp: number;
  }> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private init() {
    // Usar requestIdleCallback para inicializar quando o browser estiver livre
    const initWhenIdle = () => {
      const existingContainer = document.getElementById('delayed-toast-container');
      if (existingContainer) {
        document.body.removeChild(existingContainer);
      }
      
      this.container = document.createElement('div');
      this.container.id = 'delayed-toast-container';
      this.container.style.cssText = `
        position: fixed !important;
        top: 20px !important;
        right: 20px !important;
        z-index: 2147483647 !important;
        pointer-events: none !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif !important;
      `;
      
      document.body.appendChild(this.container);
      console.log('⏰ Delayed Toast Container criado');
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(initWhenIdle);
    } else {
      setTimeout(initWhenIdle, 0);
    }
  }

  private clearExisting() {
    if (this.showTimer) {
      clearTimeout(this.showTimer);
      this.showTimer = null;
    }

    if (this.removeTimer) {
      clearTimeout(this.removeTimer);
      this.removeTimer = null;
    }
    
    if (this.currentToast && this.container && this.container.contains(this.currentToast)) {
      this.container.removeChild(this.currentToast);
      this.currentToast = null;
      console.log('🧹 Delayed toast anterior removido');
    }
  }

  private processQueue() {
    if (this.toastQueue.length === 0) return;
    
    const toastItem = this.toastQueue.shift()!;
    this.showImmediately(toastItem.message, toastItem.type, toastItem.duration);
  }

  private showImmediately(message: string, type: 'success' | 'error' | 'warning' | 'info', duration: number) {
    const toastId = Date.now();
    console.log(`⏰ DELAYED TOAST #${toastId}: ${type} - "${message}" (${duration}ms)`);
    
    if (!this.container || !document.body.contains(this.container)) {
      this.init();
      // Retentar após inicialização
      setTimeout(() => this.showImmediately(message, type, duration), 100);
      return;
    }
    
    this.clearExisting();

    const toast = document.createElement('div');
    toast.setAttribute('data-toast-id', toastId.toString());
    
    toast.style.cssText = `
      background: ${this.getBackgroundColor(type)} !important;
      color: ${this.getTextColor(type)} !important;
      padding: 16px 20px !important;
      border-radius: 8px !important;
      box-shadow: 0 8px 25px rgba(0,0,0,0.25) !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif !important;
      font-size: 14px !important;
      font-weight: 500 !important;
      line-height: 1.4 !important;
      max-width: 400px !important;
      word-wrap: break-word !important;
      border-left: 4px solid ${this.getBorderColor(type)} !important;
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

    const icon = this.getIcon(type);
    const safeMessage = this.escapeHtml(message);
    
    toast.innerHTML = `
      <div style="display: flex !important; align-items: flex-start !important; gap: 10px !important;">
        <span style="font-size: 16px !important; line-height: 1 !important; flex-shrink: 0 !important;">${icon}</span>
        <span style="flex: 1 !important;">${safeMessage}</span>
      </div>
    `;

    // Usar múltiplos frames para garantir que seja renderizado após re-renders
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (this.container) {
            this.container.appendChild(toast);
            this.currentToast = toast;
            console.log(`📤 Delayed Toast #${toastId} finalmente adicionado ao DOM`);
          }
        });
      });
    });

    this.removeTimer = window.setTimeout(() => {
      if (this.currentToast === toast && this.container && this.container.contains(toast)) {
        this.container.removeChild(toast);
        console.log(`🗑️ Delayed Toast #${toastId} removido automaticamente`);
        
        if (this.currentToast === toast) {
          this.currentToast = null;
        }
      }
      this.removeTimer = null;
      
      // Processar próximo item da fila
      setTimeout(() => this.processQueue(), 100);
    }, duration);
  }

  show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration: number = 5000) {
    console.log(`⏰ QUEUEING DELAYED TOAST: ${type} - "${message}"`);
    
    // Adicionar à fila
    this.toastQueue.push({
      message,
      type,
      duration,
      timestamp: Date.now()
    });

    // Processar após delay para evitar conflitos com re-renders
    if (this.showTimer) {
      clearTimeout(this.showTimer);
    }

    this.showTimer = window.setTimeout(() => {
      console.log('⏰ Processando fila de toasts...');
      this.processQueue();
      this.showTimer = null;
    }, 500); // Delay de 500ms para deixar re-renders terminarem

    return Date.now();
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  private getBackgroundColor(type: string): string {
    switch (type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';  
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  }

  private getTextColor(type: string): string {
    return type === 'warning' ? '#000000' : '#ffffff';
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

  clear() {
    this.clearExisting();
    this.toastQueue = [];
    console.log('🧹 Delayed Toast e fila limpos');
  }

  success(message: string, duration?: number) {
    return this.show(message, 'success', duration);
  }

  error(message: string, duration?: number) {
    return this.show(message, 'error', duration || 8000);
  }

  warning(message: string, duration?: number) {
    return this.show(message, 'warning', duration);
  }

  info(message: string, duration?: number) {
    return this.show(message, 'info', duration);
  }
}

// Instância global única
export const delayedToast = new DelayedToastManager();

// Hook para usar no React
export const useDelayedToast = () => delayedToast;
