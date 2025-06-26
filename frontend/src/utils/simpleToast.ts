// Toast extremamente simples que só aparece e some - sem animações
class SimpleToastManager {
  private container: HTMLElement | null = null;
  private currentToast: HTMLElement | null = null;
  private removeTimer: number | null = null;

  private ensureContainer() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'simple-toast-container';
      this.container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 999999;
        pointer-events: none;
      `;
      document.body.appendChild(this.container);
      console.log('📦 Toast container criado');
    }
  }

  private clearExisting() {
    if (this.removeTimer) {
      clearTimeout(this.removeTimer);
      this.removeTimer = null;
    }
    
    if (this.currentToast && this.container) {
      this.container.removeChild(this.currentToast);
      this.currentToast = null;
      console.log('🧹 Toast anterior removido');
    }
  }

  show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration: number = 5000) {
    console.log(`🔥 SIMPLE TOAST: ${type} - "${message}" (${duration}ms)`);
    
    this.ensureContainer();
    this.clearExisting();

    // Criar toast
    const toast = document.createElement('div');
    const timestamp = Date.now();
    
    // Estilos básicos sem animações
    toast.style.cssText = `
      background: ${this.getBackgroundColor(type)};
      color: ${this.getTextColor(type)};
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      font-size: 14px;
      font-weight: 500;
      line-height: 1.4;
      max-width: 400px;
      word-wrap: break-word;
      border-left: 4px solid ${this.getBorderColor(type)};
      pointer-events: auto;
      margin-bottom: 8px;
    `;

    // Conteúdo
    const icon = this.getIcon(type);
    toast.innerHTML = `
      <div style="display: flex; align-items: flex-start; gap: 10px;">
        <span style="font-size: 16px; line-height: 1; flex-shrink: 0;">${icon}</span>
        <span style="flex: 1;">${message}</span>
      </div>
    `;

    // Adicionar ao container
    this.container!.appendChild(toast);
    this.currentToast = toast;
    
    console.log(`📤 Toast ${timestamp} adicionado ao DOM`);

    // Remover após duração
    this.removeTimer = window.setTimeout(() => {
      if (this.currentToast === toast && this.container?.contains(toast)) {
        this.container.removeChild(toast);
        console.log(`🗑️ Toast ${timestamp} removido automaticamente`);
        
        if (this.currentToast === toast) {
          this.currentToast = null;
        }
      }
      this.removeTimer = null;
    }, duration);

    return timestamp;
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
    return type === 'warning' ? '#000' : '#fff';
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
    console.log('🧹 Toast limpo manualmente');
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

// Instância global
export const simpleToast = new SimpleToastManager();

// Hook para usar no React (opcional)
export const useSimpleToast = () => simpleToast;
