import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslations } from '../i18n';
import type { Language, Translations } from '../i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Pega o idioma do localStorage ou usa pt-BR como padrão
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('taskmanager-language');
    return (saved as Language) || 'pt-BR';
  });

  const translations = useTranslations(language);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('taskmanager-language', newLanguage);
  };

  useEffect(() => {
    // Atualiza o HTML lang attribute
    document.documentElement.lang = language === 'pt-BR' ? 'pt-BR' : 'en-US';
  }, [language]);

  const value = {
    language,
    setLanguage,
    t: translations,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
