import { requirePageSession } from '@/lib/auth-context';
import Link from 'next/link';
import { listSearchHistory } from '@/lib/services/search-history';
import { History, Search } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DashedEmptyState } from '@/components/ui/empty-state';
import { HistoryList } from '@/components/features/history/HistoryList';

export default async function HistoryPage() {
  const session = await requirePageSession();

  const history = await listSearchHistory(session.userId);

  return (
    <PageShell session={session} as="main">
      <PageHeader
        icon={<History className="w-8 h-8 text-primary" />}
        title="Historial de Búsquedas"
        description="Revisa tus búsquedas recientes y retómalas rápidamente"
      />

      {history.length === 0 ? (
        <DashedEmptyState
          icon={<Search className="w-12 h-12 text-muted-foreground/50 mb-4" />}
          title="Aún no has buscado propiedades"
          description="Todas las búsquedas que realices quedarán guardadas aquí para que puedas retomarlas fácilmente."
        >
          <Link href="/" className="inline-flex items-center justify-center h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-[var(--radius)] text-sm font-medium transition-all shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] active:scale-[0.98]">
            Ir a buscar propiedades
          </Link>
        </DashedEmptyState>
      ) : (
        <HistoryList history={history} />
      )}
    </PageShell>
  );
}
