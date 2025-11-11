import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Locale } from '../types';
import { translations } from '../lib/translations';

const LANGUAGE_KEY = 'quizHeroLanguage';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, variables?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const savedLocale = localStorage.getItem(LANGUAGE_KEY);
    return (savedLocale as Locale) || 'en';
  });

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(LANGUAGE_KEY, newLocale);
  };

  const t = useCallback((key: string, variables?: { [key: string]: string | number }): string => {
    let translation = translations[locale][key] || translations['en'][key] || key;
    if (variables) {
      Object.keys(variables).forEach(varKey => {
        const regex = new RegExp(`{${varKey}}`, 'g');
        translation = translation.replace(regex, String(variables[varKey]));
      });
    }
    return translation;
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};