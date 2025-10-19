import { notFound } from 'next/navigation';
import { getResultById } from '@/lib/api/results';
import ResultsPageContent from './ResultsPageContent';

interface ResultsPageProps {
  params: Promise<{
    locale: string;
    resultId: string;
  }>;
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { resultId } = await params;

  try {
    // Fetch result data from real API
    const result = await getResultById(resultId);

    return <ResultsPageContent result={result} />;
  } catch (error) {
    console.error('Error fetching result:', error);
    notFound();
  }
}
