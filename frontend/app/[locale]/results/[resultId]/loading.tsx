export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <header className="bg-card border-b px-4 py-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-6 w-48 bg-muted animate-pulse rounded" />
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-9 w-32 bg-muted animate-pulse rounded hidden md:block" />
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="max-w-6xl mx-auto px-4 py-6 md:px-6 md:py-8">
        <div className="space-y-6 md:space-y-8">
          {/* Archetype Section Skeleton */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-muted animate-pulse rounded flex-shrink-0 mt-1" />
              <div className="flex-1 space-y-3">
                <div className="h-8 w-3/4 bg-muted animate-pulse rounded" />
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
              </div>
            </div>
          </div>

          {/* Traits Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-card rounded-lg border p-4 md:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-12 h-6 bg-muted animate-pulse rounded" />
                  <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-muted animate-pulse rounded" />
                  <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>

          {/* RIASEC Profile Skeleton */}
          <div className="bg-card rounded-lg border p-6 md:p-8">
            <div className="h-6 w-48 bg-muted animate-pulse rounded mb-6" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-12 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="h-2 w-full bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Professions Grid Skeleton */}
          <div className="bg-card rounded-lg border p-6 md:p-8">
            <div className="h-6 w-56 bg-muted animate-pulse rounded mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card rounded-lg border p-4">
                  <div className="space-y-3">
                    <div className="h-5 w-3/4 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-full bg-muted animate-pulse rounded" />
                    <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
                    <div className="h-9 w-full bg-muted animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
