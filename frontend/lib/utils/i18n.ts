import type { MultilingualText } from '@/types/profession';

/**
 * Extract the text in the current locale from a multilingual object
 * @param text Multilingual text object
 * @param locale Current locale (en, ru, kz)
 * @returns The text in the specified locale
 */
export function getLocalizedText(
  text: MultilingualText,
  locale: string
): string {
  const lang = (locale as 'en' | 'ru' | 'kz') || 'en';
  return text[lang] || text.en; // Fallback to English if translation is missing
}

/**
 * Extract an array of localized texts
 * @param texts Array of multilingual text objects
 * @param locale Current locale
 * @returns Array of texts in the specified locale
 */
export function getLocalizedTexts(
  texts: MultilingualText[],
  locale: string
): string[] {
  return texts.map(text => getLocalizedText(text, locale));
}
