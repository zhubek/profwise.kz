export const locales = ['en', 'ru', 'kz'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ru';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ru: 'Русский',
  kz: 'Қазақша',
};
