import * as React from 'react';
import { PropertyData } from '@/types/domain';
import { PropertyCard } from '@/components/features/property/PropertyCard';
import { PropertyCardSkeleton } from '@/components/features/property/PropertyCardSkeleton';
import { Search, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Pagination } from '@/components/features/search/Pagination';
import { getOperationSentence, getPropertyTypeSentence } from '@/constants/labels';

export type GridState = 'initial' | 'loading' | 'success' | 'empty' | 'error';

interface ResultsGridProps {
  state: GridState;
  results: PropertyData[] | null;
  totalResults?: number;
  error?: string | null;
  onRetry?: () => void;
  onClearFilters?: () => void;
  operation?: string;
  propertyType?: string;
  locationName?: string;
  page?: number;
  onPageChange?: (newPage: number) => void;
  favoriteIds?: string[];
}

const GridWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
    {children}
  </div>
);

export function ResultsGrid({ state, results, totalResults = 0, error, onRetry, onClearFilters, operation, propertyType, locationName, page = 1, onPageChange, favoriteIds = [] }: ResultsGridProps) {

  if (state === 'initial') {
    return null;
  }

  if (state === 'error') {
    return (
      <EmptyState
        tone="danger"
        icon={<AlertCircle className="w-12 h-12 text-red-500 mb-4" />}
        title="Tuvimos un problema"
        description={error || 'El portal inmobiliario no respondió. Puede deberse a un bloqueo temporal o problemas de conexión.'}
      >
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            Reintentar Búsqueda
          </Button>
        )}
      </EmptyState>
    );
  }

  if (state === 'empty') {
    return (
      <EmptyState
        icon={<Search className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />}
        title="No encontramos propiedades"
        description="Los filtros actuales son muy restrictivos o no hay más resultados en esta página. Prueba ampliando el rango de precio o volviendo a la página anterior."
      >
        <div className="flex gap-4">
          {page > 1 && onPageChange && (
            <Button variant="outline" onClick={() => onPageChange(page - 1)}>
              Volver Atrás
            </Button>
          )}
          {onClearFilters && (
            <Button variant="outline" onClick={onClearFilters}>
              Limpiar Filtros
            </Button>
          )}
        </div>
      </EmptyState>
    );
  }

  if (state === 'loading') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground animate-pulse mb-6">
          <Search className="w-4 h-4" />
          <span className="text-[14px] font-medium">Buscando en el portal...</span>
        </div>
        <GridWrapper>
          {Array.from({ length: 9 }).map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </GridWrapper>
      </div>
    );
  }

  // state === 'success'
  return (
    <div className="space-y-8 pb-12">
      <h3 className="text-[16px] font-medium text-foreground">
        {totalResults > 0 ? totalResults.toLocaleString('es-CL') : (results?.length || 0)} {getPropertyTypeSentence(propertyType)} {getOperationSentence(operation)}{locationName ? ` en ${locationName}` : ''}
      </h3>

      <GridWrapper>
        {results?.map((prop, idx) => (
          <PropertyCard
            key={prop.externalId || idx}
            property={prop}
            operation={operation}
            initialIsFavorite={favoriteIds.includes(prop.externalId)}
          />
        ))}
      </GridWrapper>

      <Pagination page={page} hasNextPage={!!results && results.length >= 10} onPageChange={onPageChange} />
    </div>
  );
}
