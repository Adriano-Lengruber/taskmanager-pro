import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { simpleToast } from '../utils/simpleToast';

const LoginUltraMinimal: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log('🔬 ULTRA MINIMAL LOGIN - Tentando login...');

    try {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular erro sempre (para testar o toast)
      throw new Error('Credenciais inválidas');
    } catch (err: any) {
      console.error('🔬 ULTRA MINIMAL LOGIN - Erro:', err);
      
      const errorMessage = 'Usuário ou senha incorretos. Verifique suas credenciais e tente novamente.';
      
      console.log('🔥 ULTRA MINIMAL LOGIN - Chamando simpleToast.error...');
      simpleToast.error(errorMessage, 10000);
    } finally {
      setIsLoading(false);
    }
  };

  const testToastDirect = () => {
    console.log('🔥 ULTRA MINIMAL LOGIN - Teste direto do toast...');
    simpleToast.error('Teste direto do toast na página ultra minimal', 8000);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f9fafb',
      padding: '20px'
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
          fontSize: '24px', 
          fontWeight: 'bold',
          marginBottom: '24px'
        }}>
          🧪 Login Ultra Minimal
        </h2>
        
        <p style={{ 
          textAlign: 'center', 
          fontSize: '14px', 
          color: '#666',
          marginBottom: '32px'
        }}>
          Zero contextos, Zero Tailwind, Zero dependências externas
        </p>

        <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
              Email
            </label>
            <input
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              placeholder="Digite seu e-mail"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
              Senha
            </label>
            <input
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Digite sua senha"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: isLoading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginBottom: '16px'
            }}
          >
            {isLoading ? 'Entrando...' : 'Entrar (vai dar erro)'}
          </button>

          <button
            type="button"
            onClick={testToastDirect}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            🔥 Teste Toast Direto
          </button>
        </form>

        <div style={{ 
          padding: '16px', 
          backgroundColor: '#f3f4f6', 
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          <strong>🔬 Debug Ultra Minimal:</strong>
          <div style={{ marginTop: '8px' }}>
            • Zero contextos React customizados<br/>
            • Zero Tailwind CSS<br/>
            • Zero hooks complexos<br/>
            • Zero dependências externas<br/>
            • CSS inline puro<br/>
            • JavaScript vanilla
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginUltraMinimal;
