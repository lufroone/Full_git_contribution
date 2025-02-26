import { useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

export const useLanguage = () => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const userLanguage = navigator.language.split('-')[0];
    setLanguage(userLanguage === 'fr' ? 'fr' : 'en');
  }, []);

  const t = (key: string) => {
    const keys = key.split('.');
    let translation: any = translations[language as keyof typeof translations];
    
    for (const k of keys) {
      translation = translation[k];
    }
    
    return translation || key;
  };

  return { t, language };
}; 