import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/config/i18n';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthWrapper from '@/components/features/auth/AuthWrapper';
import LayoutWrapper from '@/components/layout/LayoutWrapper';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return {
    other: {
      'html-lang': locale,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <AuthProvider>
        <AuthWrapper>
          <LayoutWrapper>{children}</LayoutWrapper>
        </AuthWrapper>
      </AuthProvider>
    </NextIntlClientProvider>
  );
}
