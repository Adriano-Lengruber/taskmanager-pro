/**
 * Toast System Resiliente - Versão Final
 * Este sistema é resistente a eventos beforeunload causados por alert() e outros
 * Soluciona o problema onde toasts são destruídos quando alert() dispara beforeunload
 */

interface ToastOptions {
  duration?: number;
  persistent?: boolean;
  type?: 'success' | 'error' | 'warning' | 'info';
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: number;
  duration: number;
  persistent: boolean;
}

class ResilientToastManager {
  private static instance: ResilientToastManager | null = null;
  private container: HTMLElement | null = null;
  private toasts: Map<string, Toast> = new Map();
  private isDestroyed = false;
  private alertDetectionFlag = false;

  constructor() {
    if (ResilientToastManager.instance) {
      return ResilientToastManager.instance;
    }

    this.init();
    ResilientToastManager.instance = this;
  }

  private init() {
    if (typeof window === 'undefined') return;

    this.createContainer();
    this.setupEventListeners();
    
    console.log('🛡️ ResilientToast initialized');
  }

  private createContainer() {
    if (this.container) return;

    this.container = document.createElement('div');
    this.container.id = 'resilient-toast-container';
    this.container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 999999;
      pointer-events: none;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    document.body.appendChild(this.container);
  }

  private setupEventListeners() {
    // Detecta quando alert() é chamado
    const originalAlert = window.alert;
    window.alert = (...args) => {
      console.log('🚨 Alert detected - setting protection flag');
      this.alertDetectionFlag = true;
      
      const result = originalAlert.apply(window, args);
      
      // Remove a flag após um tempo para não interferir com outros beforeunload
      setTimeout(() => {
        this.alertDetectionFlag = false;
        console.log('🛡️ Alert protection flag removed');
      }, 1000);
      
      return result;
    };

    // Beforeunload inteligente - só destrói se não for causado por alert
    window.addEventListener('beforeunload', () => {
      if (this.alertDetectionFlag) {
        console.log('🛡️ Beforeunload caused by alert - NOT destroying toasts');
        return;
      }
      
      console.log('🚪 Normal beforeunload - destroying toasts');
      this.destroy();
    });

    // Monitora mudanças no DOM para recriar container se necessário
    const observer = new MutationObserver(() => {
      if (!document.body.contains(this.container) && !this.isDestroyed) {
        console.log('🔄 Container removed from DOM - recreating');
        this.createContainer();
        this.renderAllToasts();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  private generateId(): string {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private createToastElement(toast: Toast): HTMLElement {
    const element = document.createElement('div');
    element.id = toast.id;
    element.style.cssText = `
      background: ${this.getBackgroundColor(toast.type)};
      color: white;
      padding: 12px 16px;
      margin-bottom: 8px;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      pointer-events: auto;
      cursor: pointer;
      max-width: 300px;
      word-wrap: break-word;
      font-size: 14px;
      line-height: 1.4;
      animation: slideIn 0.3s ease-out;
      position: relative;
    `;

    element.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 16px;">${this.getIcon(toast.type)}</span>
        <span style="flex: 1;">${toast.message}</span>
        <span style="font-size: 12px; opacity: 0.8; cursor: pointer;" onclick="resilientToast.remove('${toast.id}')">×</span>
      </div>
    `;

    // Adiciona animação CSS se não existir
    if (!document.querySelector('#resilient-toast-styles')) {
      const style = document.createElement('style');
      style.id = 'resilient-toast-styles';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    return element;
  }

  private getBackgroundColor(type: string): string {
    switch (type) {
      case 'success': return '#4CAF50';
      case 'error': return '#F44336';
      case 'warning': return '#FF9800';
      case 'info': return '#2196F3';
      default: return '#666';
    }
  }

  private getIcon(type: string): string {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📝';
    }
  }

  private renderAllToasts() {
    if (!this.container) return;

    this.container.innerHTML = '';
    
    for (const toast of this.toasts.values()) {
      const element = this.createToastElement(toast);
      this.container.appendChild(element);
    }
  }

  private show(message: string, type: 'success' | 'error' | 'warning' | 'info', options: ToastOptions = {}) {
    if (this.isDestroyed) {
      console.log('🛡️ Toast manager was destroyed, reinitializing...');
      this.isDestroyed = false;
      this.init();
    }

    const toast: Toast = {
      id: this.generateId(),
      message,
      type,
      timestamp: Date.now(),
      duration: options.duration ?? (type === 'error' ? 10000 : 5000),
      persistent: options.persistent ?? false
    };

    this.toasts.set(toast.id, toast);
    
    console.log(`🛡️ Creating ${type} toast:`, message);
    
    if (this.container) {
      const element = this.createToastElement(toast);
      this.container.appendChild(element);
    }

    // Auto-remove se não for persistente
    if (!toast.persistent) {
      setTimeout(() => {
        this.remove(toast.id);
      }, toast.duration);
    }

    return toast.id;
  }

  public success(message: string, options?: ToastOptions) {
    return this.show(message, 'success', options);
  }

  public error(message: string, options?: ToastOptions) {
    // Para erros de login, usar duração maior por padrão
    const defaultDuration = message.toLowerCase().includes('login') || 
                            message.toLowerCase().includes('credencial') ||
                            message.toLowerCase().includes('senha') ||
                            message.toLowerCase().includes('usuário') ? 15000 : 10000;
    
    return this.show(message, 'error', { duration: defaultDuration, ...options });
  }

  public warning(message: string, options?: ToastOptions) {
    return this.show(message, 'warning', options);
  }

  public info(message: string, options?: ToastOptions) {
    return this.show(message, 'info', options);
  }

  public remove(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      }, 300);
    }
    
    this.toasts.delete(id);
    console.log(`🛡️ Toast removed: ${id}`);
  }

  public clear() {
    this.toasts.clear();
    if (this.container) {
      this.container.innerHTML = '';
    }
    console.log('🛡️ All toasts cleared');
  }

  public destroy() {
    console.log('🛡️ Destroying ResilientToast (but only if not protected)');
    this.isDestroyed = true;
    this.clear();
    
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
      this.container = null;
    }
    
    ResilientToastManager.instance = null;
  }

  public getStats() {
    return {
      activeToasts: this.toasts.size,
      isDestroyed: this.isDestroyed,
      hasContainer: !!this.container,
      alertProtection: this.alertDetectionFlag
    };
  }
}

// Singleton instance
export const resilientToast = new ResilientToastManager();

// Global access para debugging
if (typeof window !== 'undefined') {
  (window as any).resilientToast = resilientToast;
}
