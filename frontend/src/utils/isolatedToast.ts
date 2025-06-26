// Toast completamente isolado do React usando eventos globais
class IsolatedToastManager {
  private container: HTMLElement | null = null;
  private currentToast: HTMLElement | null = null;
  private removeTimer: number | null = null;
  private toastCount = 0;

  constructor() {
    // Garantir que seja criado apenas uma vez
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private init() {
    // Limpar qualquer container existente
    const existingContainer = document.getElementById('isolated-toast-container');
    if (existingContainer) {
      document.body.removeChild(existingContainer);
    }
    
    // Criar container isolado
    this.container = document.createElement('div');
    this.container.id = 'isolated-toast-container';
    this.container.style.cssText = `
      position: fixed !important;
      top: 20px !important;
      right: 20px !important;
      z-index: 2147483647 !important;
      pointer-events: none !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif !important;
    `;
    
    // Adicionar ao body de forma isolada
    document.body.appendChild(this.container);
    console.log('🔒 Isolated Toast Container criado');
  }

  private clearExisting() {
    if (this.removeTimer) {
      clearTimeout(this.removeTimer);
      this.removeTimer = null;
    }
    
    if (this.currentToast && this.container && this.container.contains(this.currentToast)) {
      this.container.removeChild(this.currentToast);
      this.currentToast = null;
      console.log('🧹 Toast anterior removido (isolated)');
    }
  }

  show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration: number = 5000) {
    this.toastCount++;
    const toastId = this.toastCount;
    
    console.log(`🔒 ISOLATED TOAST #${toastId}: ${type} - "${message}" (${duration}ms)`);
    
    // Garantir que o container existe
    if (!this.container || !document.body.contains(this.container)) {
      this.init();
    }
    
    this.clearExisting();

    // Criar toast com estilos completamente isolados
    const toast = document.createElement('div');
    toast.setAttribute('data-toast-id', toastId.toString());
    
    // Estilos com !important para evitar interferência CSS
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

    // Conteúdo com proteção contra XSS
    const icon = this.getIcon(type);
    const safeMessage = this.escapeHtml(message);
    
    toast.innerHTML = `
      <div style="display: flex !important; align-items: flex-start !important; gap: 10px !important;">
        <span style="font-size: 16px !important; line-height: 1 !important; flex-shrink: 0 !important;">${icon}</span>
        <span style="flex: 1 !important;">${safeMessage}</span>
      </div>
    `;

    // Adicionar ao container usando requestAnimationFrame para evitar conflitos
    requestAnimationFrame(() => {
      if (this.container) {
        this.container.appendChild(toast);
        this.currentToast = toast;
        console.log(`📤 Isolated Toast #${toastId} adicionado ao DOM`);
      }
    });

    // Remover após duração usando requestIdleCallback se disponível
    const removeToast = () => {
      if (this.currentToast === toast && this.container && this.container.contains(toast)) {
        this.container.removeChild(toast);
        console.log(`🗑️ Isolated Toast #${toastId} removido automaticamente`);
        
        if (this.currentToast === toast) {
          this.currentToast = null;
        }
      }
      this.removeTimer = null;
    };

    this.removeTimer = window.setTimeout(removeToast, duration);

    return toastId;
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
    console.log('🧹 Isolated Toast limpo manualmente');
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
export const isolatedToast = new IsolatedToastManager();

// Hook para usar no React (retorna sempre a mesma instância)
export const useIsolatedToast = () => isolatedToast;
