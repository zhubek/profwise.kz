import { notFound } from 'next/navigation';
import { getProfessionEducation } from '@/lib/api/professions';
import EducationContent from './EducationContent';

// Enable Cloudflare caching - cache for 24 hours
export const revalidate = 86400;
export const dynamicParams = true;

interface EducationPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function EducationPage({ params }: EducationPageProps) {
  const { id, locale } = await params;

  try {
    const education = await getProfessionEducation(id);

    return <EducationContent education={education} locale={locale} />;
  } catch (error) {
    console.error('Error fetching profession education:', error);
    notFound();
  }
}
