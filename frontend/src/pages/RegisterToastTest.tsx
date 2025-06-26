import React, { useState } from 'react';
import { useToast } from '../contexts/SuperStableToastContext';

export const RegisterToastTest: React.FC = () => {
  console.log('RegisterToastTest: Component is rendering');
  
  const [test, setTest] = useState('');
  
  try {
    const { showSuccess, showError } = useToast();
    
    const handleTestSuccess = () => {
      showSuccess('🎉 Toast de sucesso funcionando!');
      setTest('Toast de sucesso testado');
    };

    const handleTestError = () => {
      showError('❌ Toast de erro funcionando!');
      setTest('Toast de erro testado');
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
            Toast Test Page
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

            <p style={{ 
              textAlign: 'center', 
              marginTop: '16px',
              color: '#6b7280'
            }}>
              Status: {test || 'Nenhum teste executado'}
            </p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('RegisterToastTest: Error rendering component:', error);
    return (
      <div style={{ padding: '20px', backgroundColor: 'red', color: 'white' }}>
        <h1>ERRO NO TOAST CONTEXT</h1>
        <p>Erro: {error instanceof Error ? error.message : 'Erro desconhecido'}</p>
      </div>
    );
  }
};
