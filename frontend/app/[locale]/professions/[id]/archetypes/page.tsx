import { notFound } from 'next/navigation';
import { getProfessionArchetypes } from '@/lib/api/professions';
import ArchetypesContent from './ArchetypesContent';

// Enable Cloudflare caching - cache for 24 hours
export const revalidate = 86400;
export const dynamicParams = true;

interface ArchetypesPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function ArchetypesPage({ params }: ArchetypesPageProps) {
  const { id } = await params;

  try {
    const archetypes = await getProfessionArchetypes(id);

    return <ArchetypesContent archetypes={archetypes} />;
  } catch (error) {
    console.error('Error fetching profession archetypes:', error);
    notFound();
  }
}
