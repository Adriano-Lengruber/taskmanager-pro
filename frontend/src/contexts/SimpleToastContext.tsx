import React, { createContext, useContext } from 'react';

interface SimpleToastContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

const SimpleToastContext = createContext<SimpleToastContextType | undefined>(undefined);

export function SimpleToastProvider({ children }: { children: React.ReactNode }) {
  console.log('SimpleToastProvider: Rendering');
  
  const showSuccess = (message: string) => {
    console.log('SUCCESS TOAST:', message);
    alert(`SUCCESS: ${message}`);
  };

  const showError = (message: string) => {
    console.log('ERROR TOAST:', message);
    alert(`ERROR: ${message}`);
  };

  const value: SimpleToastContextType = {
    showSuccess,
    showError
  };

  return (
    <SimpleToastContext.Provider value={value}>
      {children}
    </SimpleToastContext.Provider>
  );
}

export function useSimpleToast() {
  const context = useContext(SimpleToastContext);
  if (context === undefined) {
    throw new Error('useSimpleToast must be used within a SimpleToastProvider');
  }
  return context;
}
