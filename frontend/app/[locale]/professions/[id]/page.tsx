import { notFound } from 'next/navigation';
import { getProfessionDetails } from '@/lib/api/professions';
import ProfessionContent from './ProfessionContent';

// Cache this page for 1 hour (3600 seconds)
export const revalidate = 3600;

interface ProfessionPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function ProfessionPage({ params }: ProfessionPageProps) {
  const { id, locale } = await params;

  try {
    const profession = await getProfessionDetails(id);

    return <ProfessionContent profession={profession} locale={locale} />;
  } catch (error) {
    console.error('Error fetching profession details:', error);
    notFound();
  }
}
