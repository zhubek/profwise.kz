import { notFound } from 'next/navigation';
import { getProfessionDetails } from '@/lib/api/professions';
import ProfessionContent from './ProfessionContent';

// Enable Cloudflare caching - cache for 24 hours
export const revalidate = 86400;
export const dynamicParams = true; // Allow new profession IDs

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
