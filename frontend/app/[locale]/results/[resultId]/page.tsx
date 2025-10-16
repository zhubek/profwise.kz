import { notFound } from 'next/navigation';
import { getTestResult } from '@/lib/api/mock/results';
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
    // Fetch result data server-side
    const result = await getTestResult(resultId);

    return <ResultsPageContent result={result} />;
  } catch (error) {
    console.error('Error fetching result:', error);
    notFound();
  }
}
