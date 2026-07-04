import { requirePageSession } from '@/lib/auth-context';
import Link from 'next/link';
import { listFavorites } from '@/lib/services/favorites';
import { PropertyCard } from '@/components/features/property/PropertyCard';
import { Heart, Home } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DashedEmptyState } from '@/components/ui/empty-state';
import { parseJson } from '@/lib/formatters';
import type { PropertyData } from '@/types/domain';

export default async function FavoritesPage() {
  const session = await requirePageSession();

  const userFavorites = await listFavorites(session.userId);

  return (
    <PageShell session={session} as="main">
      <PageHeader
        icon={<Heart className="w-8 h-8 text-primary fill-primary" />}
        title="Mis Favoritos"
        description="Propiedades que has guardado para ver después"
      />

      {userFavorites.length === 0 ? (
        <DashedEmptyState
          size="lg"
          icon={<Home className="w-16 h-16 text-muted-foreground/30 mt-4 mb-6" />}
          title="No tienes propiedades favoritas"
          description="Explora el buscador y haz clic en el corazón de cualquier propiedad para guardarla en esta lista."
        >
          <Link href="/" className="inline-flex items-center justify-center h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-[var(--radius)] text-sm font-medium transition-all shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] active:scale-[0.98] mb-4">
            Ir al buscador
          </Link>
        </DashedEmptyState>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userFavorites.map((fav) => {
            const property = parseJson<PropertyData>(fav.snapshot);
            return <PropertyCard key={fav.id} property={property} initialIsFavorite={true} operation="Guardado" />;
          })}
        </div>
      )}
    </PageShell>
  );
}
