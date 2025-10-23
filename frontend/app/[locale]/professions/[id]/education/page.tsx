import { notFound } from 'next/navigation';
import { getProfessionEducation } from '@/lib/api/professions';
import EducationContent from './EducationContent';

// Cache this page for 24 hours (86400 seconds)
export const revalidate = 86400;

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
