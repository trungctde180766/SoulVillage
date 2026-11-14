import React, { createContext, useContext, useState } from 'react';
import viMessages from '../../messages/vi.json';
import enMessages from '../../messages/en.json';

export type SupportedLocale = 'vi' | 'en';
export type MessagesDictionary = typeof viMessages;

const dictionaries: Record<SupportedLocale, MessagesDictionary> = {
  vi: viMessages,
  en: enMessages,
};

interface LocaleContextValue {
  locale: SupportedLocale;
  setLocale: (next: SupportedLocale) => void;
  t: MessagesDictionary;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'vi',
  setLocale: () => undefined,
  t: viMessages,
});

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<SupportedLocale>('vi');
  const value: LocaleContextValue = {
    locale,
    setLocale,
    t: dictionaries[locale] || dictionaries.vi,
  };

  return React.createElement(LocaleContext.Provider, { value }, children);
};

export function getMessages(locale: SupportedLocale = 'vi'): MessagesDictionary {
  return dictionaries[locale] || dictionaries.vi;
}

export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext);
}

export function useTranslations(explicitLocale?: SupportedLocale): MessagesDictionary {
  const context = useContext(LocaleContext);
  if (explicitLocale) {
    return getMessages(explicitLocale);
  }
  return context.t;
}
