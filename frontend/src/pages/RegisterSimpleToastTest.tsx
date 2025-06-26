import React from 'react';
import { useSimpleToast } from '../contexts/SimpleToastContext';

export const RegisterSimpleToastTest: React.FC = () => {
  console.log('RegisterSimpleToastTest: Component is rendering');
  
  try {
    const { showSuccess, showError } = useSimpleToast();
    
    const handleTestSuccess = () => {
      showSuccess('Toast simples funcionando!');
    };

    const handleTestError = () => {
      showError('Toast de erro simples funcionando!');
    };

    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
        padding: '48px 16px'
      }}>
        <div style={{ 
          maxWidth: '400px', 
          width: '100%',
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ 
            textAlign: 'center', 
            fontSize: '32px', 
            fontWeight: 'bold',
            marginBottom: '24px',
            color: '#111827'
          }}>
            Simple Toast Test
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button
              onClick={handleTestSuccess}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Testar Toast Sucesso
            </button>

            <button
              onClick={handleTestError}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Testar Toast Erro
            </button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('RegisterSimpleToastTest: Error:', error);
    return (
      <div style={{ padding: '20px', backgroundColor: 'red', color: 'white' }}>
        <h1>ERRO NO SIMPLE TOAST CONTEXT</h1>
        <p>Erro: {error instanceof Error ? error.message : 'Erro desconhecido'}</p>
      </div>
    );
  }
};
