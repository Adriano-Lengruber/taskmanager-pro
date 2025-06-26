// Ultra Delayed Toast - Especialmente para contextos que fazem muitos re-renders
// Usa delays longos para garantir que o toast apareça após todos os re-renders

interface ToastConfig {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose?: () => void;
}

class UltraDelayedToastManager {
  private toastCounter = 0;
  private activeToasts = new Map<string, HTMLElement>();
  private toastContainer: HTMLElement | null = null;
  private pendingToasts: Array<{ config: ToastConfig; delay: number; timestamp: number }> = [];
  private processingTimeout: number | null = null;
  private containerObserver: MutationObserver | null = null;

  constructor() {
    this.ensureContainer();
  }

  private ensureContainer() {
    // Verificar se o container ainda existe e está no DOM
    if (this.toastContainer && document.body.contains(this.toastContainer)) {
      console.log('🚀 UltraDelayedToast: Container já existe e está no DOM');
      return;
    }

    console.log('🚀 UltraDelayedToast: Container não existe ou foi removido, criando novo...');

    // Remove container antigo se existir
    const oldContainer = document.getElementById('ultra-delayed-toast-container');
    if (oldContainer) {
      console.log('🗑️ UltraDelayedToast: Removendo container antigo');
      oldContainer.remove();
    }

    // Criar novo container completamente isolado
    this.toastContainer = document.createElement('div');
    this.toastContainer.id = 'ultra-delayed-toast-container';
    this.toastContainer.style.cssText = `
      position: fixed !important;
      top: 20px !important;
      right: 20px !important;
      z-index: 2147483647 !important;
      pointer-events: none !important;
      max-width: 400px !important;
      min-width: 300px !important;
    `;

    // Adicionar ao body como último elemento
    document.body.appendChild(this.toastContainer);
    console.log('✅ UltraDelayedToast: Container criado e adicionado ao DOM');

    // Limpar observer anterior se existir
    if (this.containerObserver) {
      this.containerObserver.disconnect();
    }

    // NOVO: Adicionar listener para detectar quando o container é removido
    this.containerObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          for (const removedNode of mutation.removedNodes) {
            if (removedNode === this.toastContainer) {
              console.warn('⚠️ UltraDelayedToast: Container foi removido do DOM! Recriando...');
              setTimeout(() => this.ensureContainer(), 100);
              return;
            }
          }
        }
      }
    });

    this.containerObserver.observe(document.body, { childList: true });
  }

  private createToast(config: ToastConfig): string {
    // Garantir que o container existe SEMPRE antes de criar o toast
    this.ensureContainer();
    
    if (!this.toastContainer || !document.body.contains(this.toastContainer)) {
      console.error('❌ UltraDelayedToast: Não foi possível garantir container, tentando novamente...');
      setTimeout(() => this.createToast(config), 100);
      return '';
    }
    
    const toastId = `ultra-delayed-toast-${++this.toastCounter}-${Date.now()}`;
    
    // Cores para cada tipo
    const colors = {
      success: { bg: '#10b981', text: '#ffffff', border: '#059669' },
      error: { bg: '#ef4444', text: '#ffffff', border: '#dc2626' },
      warning: { bg: '#f59e0b', text: '#000000', border: '#d97706' },
      info: { bg: '#3b82f6', text: '#ffffff', border: '#2563eb' }
    };

    const color = colors[config.type];
    const icon = this.getIcon(config.type);

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
      border-left: 4px solid ${color.border} !important;
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
    const safeMessage = this.escapeHtml(config.message);
    
    toastElement.innerHTML = `
      <div style="display: flex !important; align-items: flex-start !important; gap: 10px !important;">
        <span style="font-size: 16px !important; line-height: 1 !important; flex-shrink: 0 !important;">${icon}</span>
        <span style="flex: 1 !important;">${safeMessage}</span>
      </div>
    `;

    // Tentar adicionar ao container
    try {
      this.toastContainer.appendChild(toastElement);
      this.activeToasts.set(toastId, toastElement);
      console.log(`✅ UltraDelayedToast: Toast ${toastId} criado e adicionado (${config.type}): "${config.message}"`);
    } catch (error) {
      console.error(`❌ UltraDelayedToast: Erro ao adicionar toast ${toastId}:`, error);
      // Tentar recriar container e tentar novamente
      this.ensureContainer();
      setTimeout(() => this.createToast(config), 100);
      return '';
    }

    // Configurar remoção automática
    const duration = config.duration || (config.type === 'error' ? 10000 : 5000);
    setTimeout(() => {
      this.removeToast(toastId);
    }, duration);

    // Adicionar evento de clique para fechar
    toastElement.addEventListener('click', () => {
      this.removeToast(toastId);
    });

    return toastId;
  }

  private removeToast(toastId: string) {
    const toastElement = this.activeToasts.get(toastId);
    if (!toastElement) {
      return;
    }

    console.log(`🗑️ UltraDelayedToast: Removendo toast ${toastId}`);

    // Animar saída
    toastElement.style.opacity = '0 !important';
    toastElement.style.transform = 'translateX(100%) !important';
    toastElement.style.transition = 'all 0.3s ease-in-out !important';

    setTimeout(() => {
      try {
        if (toastElement.parentNode) {
          toastElement.parentNode.removeChild(toastElement);
        }
        this.activeToasts.delete(toastId);
        console.log(`✅ UltraDelayedToast: Toast ${toastId} removido do DOM`);
      } catch (error) {
        console.error(`❌ UltraDelayedToast: Erro ao remover toast ${toastId}:`, error);
      }
    }, 300);
  }

  private processQueue() {
    console.log(`🚀 UltraDelayedToast: processQueue chamado. ${this.pendingToasts.length} toasts na fila.`);
    
    if (this.pendingToasts.length === 0) {
      console.log('🚀 UltraDelayedToast: Fila vazia, nada para processar.');
      return;
    }

    const now = Date.now();
    const toastToShow = this.pendingToasts.find(toast => {
      const elapsed = now - toast.timestamp;
      console.log(`🚀 UltraDelayedToast: Toast "${toast.config.message}" - elapsed: ${elapsed}ms, required: ${toast.delay}ms`);
      return elapsed >= toast.delay;
    });

    if (toastToShow) {
      // Remove da fila
      this.pendingToasts = this.pendingToasts.filter(t => t !== toastToShow);
      
      console.log(`🚀 UltraDelayedToast: Criando toast "${toastToShow.config.message}"`);
      // Criar toast
      this.createToast(toastToShow.config);
      
      console.log(`🚀 UltraDelayedToast: Toast processado da fila. ${this.pendingToasts.length} restantes.`);
    } else {
      console.log('🚀 UltraDelayedToast: Nenhum toast pronto para ser exibido ainda.');
    }

    // Continuar processando se ainda há toasts na fila
    if (this.pendingToasts.length > 0) {
      this.processingTimeout = window.setTimeout(() => this.processQueue(), 100);
    } else {
      this.processingTimeout = null;
    }
  }

  public show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration?: number, delay: number = 500) {
    const config: ToastConfig = { message, type, duration };
    
    console.log(`🚀 UltraDelayedToast: Agendando toast "${message}" (${type}) com delay de ${delay}ms`);
    
    // Adicionar à fila com timestamp
    this.pendingToasts.push({
      config,
      delay,
      timestamp: Date.now()
    });

    // Iniciar processamento se não estiver ativo
    if (!this.processingTimeout) {
      this.processingTimeout = window.setTimeout(() => this.processQueue(), 100);
    }
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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

  public success(message: string, duration?: number, delay?: number) {
    this.show(message, 'success', duration, delay);
  }

  public error(message: string, duration?: number, delay?: number) {
    console.log('🚀 UltraDelayedToast: ERROR method called with:', { message, duration, delay });
    this.show(message, 'error', duration || 15000, delay || 500); // Delay de apenas 500ms para teste, duração 15s
  }

  public warning(message: string, duration?: number, delay?: number) {
    this.show(message, 'warning', duration, delay);
  }

  public info(message: string, duration?: number, delay?: number) {
    this.show(message, 'info', duration, delay);
  }

  public clear() {
    console.log('🧹 UltraDelayedToast: Limpando todos os toasts');
    this.pendingToasts = [];
    
    if (this.processingTimeout) {
      clearTimeout(this.processingTimeout);
      this.processingTimeout = null;
    }
    
    this.activeToasts.forEach((_, toastId) => {
      this.removeToast(toastId);
    });
  }

  public destroy() {
    console.log('🗑️ UltraDelayedToast: Destruindo sistema de toast');
    this.clear();
    
    if (this.containerObserver) {
      this.containerObserver.disconnect();
      this.containerObserver = null;
    }
    
    if (this.toastContainer && this.toastContainer.parentNode) {
      this.toastContainer.parentNode.removeChild(this.toastContainer);
      this.toastContainer = null;
    }
  }
}

// Instância global singleton
export const ultraDelayedToast = new UltraDelayedToastManager();

// Cleanup quando a página é fechada
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    ultraDelayedToast.destroy();
  });
}
