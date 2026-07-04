import { Building2, Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { parseJson, describeSearch } from '@/lib/formatters';

interface HistoryFilters {
  operation?: string;
  propertyType?: string;
  comuna?: string;
  query?: string;
}

export interface HistoryItemCardProps {
  item: {
    id: string;
    filters: unknown;
    queryText: string | null;
    createdAt: Date;
  };
}

export function HistoryItemCard({ item }: HistoryItemCardProps) {
  const filters = parseJson<HistoryFilters>(item.filters);
  const { operation, propertyType, location } = describeSearch(filters, item.queryText);

  return (
    <div className="group bg-background border border-border rounded-[var(--radius)] p-5 hover:border-primary/30 hover:shadow-[var(--shadow-soft)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start sm:items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
          <Building2 className="w-5 h-5 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-medium text-[16px] text-foreground mb-1 capitalize">
            {operation} de {propertyType} en {location}
          </h3>
          <div className="flex items-center gap-3 text-[13px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {format(new Date(item.createdAt), "d 'de' MMMM, HH:mm", { locale: es })}
            </span>
          </div>
        </div>
      </div>

      <a
        href={`/?query=${encodeURIComponent(filters?.comuna || filters?.query || '')}&op=${filters?.operation || 'venta'}&type=${filters?.propertyType || 'departamento'}`}
        className="inline-flex items-center gap-2 text-[14px] font-medium text-primary hover:text-primary/80 transition-colors self-start sm:self-auto px-2 py-1 rounded-md hover:bg-primary/5"
      >
        Repetir búsqueda
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </a>
    </div>
  );
}
