import React from 'react';

export const RegisterMinimal: React.FC = () => {
  console.log('RegisterMinimal: Component is rendering');
  
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
          Create Account (MINIMAL)
        </h2>
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="text"
            placeholder="Full Name"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
          
          <input
            type="text"
            placeholder="Username"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
          
          <input
            type="email"
            placeholder="Email"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
          
          <input
            type="password"
            placeholder="Password"
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
        
        <p style={{ 
          textAlign: 'center', 
          marginTop: '16px',
          color: '#6b7280'
        }}>
          <a href="/login" style={{ color: '#4f46e5' }}>
            Already have an account? Sign in
          </a>
        </p>
      </div>
    </div>
  );
};
