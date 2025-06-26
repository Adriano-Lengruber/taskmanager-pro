import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Atualiza o state para mostrar a UI de erro
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log do erro para debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L3.232 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
              Oops! Algo deu errado
            </h2>
            
            <p className="text-gray-600 text-center mb-6">
              Ocorreu um erro inesperado. Você pode tentar recarregar a página ou entrar em contato com o suporte.
            </p>
            
            {/* Detalhe do erro (apenas em desenvolvimento) */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mb-4 p-3 bg-gray-100 rounded border text-sm">
                <summary className="font-medium cursor-pointer text-red-600 mb-2">
                  Detalhes técnicos (desenvolvimento)
                </summary>
                <div className="text-gray-700">
                  <strong>Erro:</strong> {this.state.error.message}
                  {this.state.errorInfo && (
                    <div className="mt-2">
                      <strong>Stack:</strong>
                      <pre className="text-xs mt-1 overflow-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
            
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                🔄 Recarregar Página
              </button>
              
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: undefined, errorInfo: undefined });
                  window.location.href = '/login';
                }}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                🏠 Voltar ao Login
              </button>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                TaskManager Pro v1.0.0
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
