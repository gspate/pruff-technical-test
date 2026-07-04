import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface PaginationProps {
  page: number;
  hasNextPage: boolean;
  onPageChange?: (newPage: number) => void;
}

export function Pagination({ page, hasNextPage, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-6 mt-8 pt-8 border-t border-border/50">
      {page > 1 ? (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block cursor-default">Anterior</span>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-10 h-10 shadow-sm"
            onClick={() => onPageChange && onPageChange(page - 1)}
            title="Página Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </div>
      ) : (
        <div className="w-[100px] hidden sm:block"></div> /* Spacer para mantener centrado */
      )}

      <span className="text-sm font-semibold text-foreground px-2">Página {page}</span>

      {hasNextPage ? (
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-10 h-10 shadow-sm"
            onClick={() => onPageChange && onPageChange(page + 1)}
            title="Siguiente Página"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
          <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block cursor-default">Siguiente</span>
        </div>
      ) : (
        <div className="w-[100px] hidden sm:block"></div> /* Spacer para mantener centrado */
      )}
    </div>
  );
}
