import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/config/i18n';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import AdminHeader from './AdminHeader';
import AdminAuthWrapper from './AdminAuthWrapper';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function AdminLayout({
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
      <AdminAuthProvider>
        <AdminAuthWrapper>
          <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
            <AdminHeader />
            <main className="flex-grow">{children}</main>
          </div>
        </AdminAuthWrapper>
      </AdminAuthProvider>
    </NextIntlClientProvider>
  );
}
