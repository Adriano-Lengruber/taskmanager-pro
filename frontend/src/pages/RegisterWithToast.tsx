import React, { useState } from 'react';
import { useToast } from '../contexts/SuperStableToastContext';

export const RegisterWithToast: React.FC = () => {
  console.log('RegisterWithToast: Component is rendering');
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: ''
  });
  
  try {
    const { showSuccess, showError, showInfo } = useToast();
    console.log('RegisterWithToast: Toast hooks loaded successfully');
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log('RegisterWithToast: Form submitted', formData);
      
      if (formData.password !== formData.confirmPassword) {
        showError('❌ Passwords do not match');
        return;
      }

      if (formData.password.length < 8) {
        showError('❌ Password must be at least 8 characters long');
        return;
      }

      showInfo('🔄 Processing registration...');
      
      // Simular processamento
      setTimeout(() => {
        showSuccess('✅ Registration successful!');
      }, 1000);
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
            Create Account (WITH TOAST)
          </h2>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              name="full_name"
              type="text"
              placeholder="Full Name"
              value={formData.full_name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
            
            <input
              name="username"
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
            
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
            
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
            
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
            
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    );
  } catch (error) {
    console.error('RegisterWithToast: Error using toast hooks:', error);
    return (
      <div style={{ padding: '20px', backgroundColor: 'red', color: 'white' }}>
        <h1>ERRO NO TOAST HOOK</h1>
        <p>Erro: {error instanceof Error ? error.message : 'Erro desconhecido'}</p>
      </div>
    );
  }
};
