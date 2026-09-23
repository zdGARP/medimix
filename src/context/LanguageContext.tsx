import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language } from '../config/languages';
import { getLanguageByCode, languages } from '../config/languages';

interface LanguageContextType {
  selectedLanguage: Language;
  setSelectedLanguageCode: (code: string) => void;
  availableLanguages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);

  useEffect(() => {
    // Load from local storage on mount
    const savedCode = localStorage.getItem('mediread_language');
    if (savedCode) {
      setSelectedLanguage(getLanguageByCode(savedCode));
    } else {
      // Auto-detect browser language as fallback maybe? Default is fine.
    }
  }, []);

  const setSelectedLanguageCode = (code: string) => {
    const lang = getLanguageByCode(code);
    setSelectedLanguage(lang);
    localStorage.setItem('mediread_language', code);
  };

  return (
    <LanguageContext.Provider value={{
      selectedLanguage,
      setSelectedLanguageCode,
      availableLanguages: languages
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
