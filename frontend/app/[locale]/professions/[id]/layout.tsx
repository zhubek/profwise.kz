import { notFound } from 'next/navigation';
import { getProfession } from '@/lib/api/professions';
import ProfessionNav from './ProfessionNav';
import { getLocalizedText } from '@/lib/utils/i18n';

interface ProfessionLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function ProfessionLayout({
  children,
  params,
}: ProfessionLayoutProps) {
  const { id, locale } = await params;

  try {
    // Fetch profession data server-side for the header
    const profession = await getProfession(id);

    return (
      <div className="min-h-screen bg-background">
        {/* Profession Header */}
        <div className="border-b bg-card">
          <div className="max-w-7xl mx-auto px-4 py-6 md:px-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                  {getLocalizedText(profession.name, locale)}
                </h1>
                <p className="text-sm text-muted-foreground mt-1 md:text-base">
                  {getLocalizedText(profession.description, locale)}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <ProfessionNav professionId={id} />
          </div>
        </div>

        {/* Page Content */}
        <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-8">
          {children}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching profession:', error);
    notFound();
  }
}
