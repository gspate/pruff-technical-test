import { getSession } from '@/lib/session';
import { listFavoriteIds } from '@/lib/services/favorites';
import { SearchEngine } from '@/components/features/search/SearchEngine';
import { PageShell } from '@/components/layout/PageShell';
import { HeroHeader } from '@/components/layout/HeroHeader';
import { DecorativeBackground } from '@/components/layout/DecorativeBackground';
import { Suspense } from 'react';

export default async function HomePage() {
  const session = await getSession();

  const favoriteIds = session?.userId ? await listFavoriteIds(session.userId) : [];

  return (
    <PageShell
      session={session}
      className="relative overflow-x-hidden"
      contentClassName="relative z-10"
      decoration={<DecorativeBackground />}
    >
      <main>
        <HeroHeader />
        <Suspense fallback={<div className="h-20" />}>
          <SearchEngine session={session} favoriteIds={favoriteIds} />
        </Suspense>
      </main>
    </PageShell>
  );
}
