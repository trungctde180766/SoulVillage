import viMessages from '../../messages/vi.json';
import enMessages from '../../messages/en.json';

export type SupportedLocale = 'vi' | 'en';
export type MessagesDictionary = typeof viMessages;

const dictionaries: Record<SupportedLocale, MessagesDictionary> = {
  vi: viMessages,
  en: enMessages,
};

export function getMessages(locale: SupportedLocale = 'vi'): MessagesDictionary {
  return dictionaries[locale] || dictionaries.vi;
}

export function useTranslations(locale: SupportedLocale = 'vi'): MessagesDictionary {
  return getMessages(locale);
}
