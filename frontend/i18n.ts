import { getRequestConfig } from 'next-intl/server';
import { locales } from './config/i18n';

export default getRequestConfig(async ({ requestLocale }) => {
  // This function gets called for each request and is not aware of the dynamic segment parameter
  // requestLocale is a promise in Next.js 15
  let locale = await requestLocale;

  // Validate that the incoming `locale` parameter is valid
  // If not, use default locale
  if (!locale || !locales.includes(locale as any)) {
    locale = 'en';
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
