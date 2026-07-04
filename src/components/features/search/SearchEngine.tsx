'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { ResultsGrid } from '@/components/features/search/ResultsGrid';
import { NearbyProperties } from '@/components/features/discovery/NearbyProperties';
import { FilterSelect } from '@/components/features/search/FilterSelect';
import { OPERATIONS, PROPERTY_TYPES } from '@/constants/labels';
import { cn } from '@/lib/utils';
import { useSearch } from '@/hooks/useSearch';
import { isPropertyCode } from '@/lib/formatters';
import type { SessionUser } from '@/types/domain';

interface SearchEngineProps {
  session: SessionUser | null;
  favoriteIds?: string[];
}

export function SearchEngine({ session, favoriteIds = [] }: SearchEngineProps) {
  const {
    filters,
    setFilters,
    activeFilters,
    page,
    gridState,
    results,
    totalResults,
    errorMsg,
    suggestions,
    isSearchingLocation,
    setIsSearchingLocation,
    showDropdown,
    setShowDropdown,
    selectedIndex,
    setSelectedIndex,
    handleSearch,
    handlePageChange,
    clearAllFilters,
  } = useSearch(session);

  // Auto-scroll para las sugerencias al usar flechas del teclado
  React.useEffect(() => {
    if (showDropdown && suggestions.length > 0) {
      const el = document.getElementById(`suggestion-${selectedIndex}`);
      if (el) {
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex, showDropdown, suggestions.length]);

  return (
    <div className="flex flex-col gap-8 pb-16">

      {/* Buscador Principal (1 Sola Fila) */}
      <section className={cn("bg-background rounded-full border shadow-[var(--shadow-hover)] p-2 md:pl-6 max-w-4xl mx-auto w-full transition-shadow relative z-[100]", session ? "border-border hover:shadow-xl" : "border-muted/50 opacity-80 cursor-not-allowed")}>
        <form onSubmit={(e) => handleSearch(e, 1)} className="flex flex-col md:flex-row items-center gap-2 w-full relative">

          <FilterSelect
            className="pr-2"
            value={filters.operation}
            onChange={(value) => setFilters(prev => ({ ...prev, operation: value }))}
            options={OPERATIONS}
            disabled={!session}
          />

          <FilterSelect
            className="pr-2 md:pl-2"
            value={filters.propertyType}
            onChange={(value) => setFilters(prev => ({ ...prev, propertyType: value }))}
            options={PROPERTY_TYPES}
            disabled={!session}
          />

          <div className="flex-[2] w-full relative md:pl-2 z-50">
            <Search className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none transition-opacity" />
            <Input
              type="text"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              placeholder={session ? "¿En qué comuna buscas?" : "Debes iniciar sesión para buscar..."}
              className="h-12 text-[15px] border-transparent bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none w-full appearance-none transition-all [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden pl-10 md:pl-12 disabled:opacity-50 disabled:cursor-not-allowed"
              value={filters.query}
              onChange={(e) => {
                const val = e.target.value;
                setFilters(prev => ({ ...prev, query: val }));
                setShowDropdown(true);
                if (val.length >= 2 && !isPropertyCode(val)) {
                  setIsSearchingLocation(true);
                } else {
                  setIsSearchingLocation(false);
                }
              }}
              onKeyDown={(e) => {
                if (!showDropdown || suggestions.length === 0) return;
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setSelectedIndex(prev => Math.max(prev - 1, 0));
                }
              }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              autoFocus={!!session}
              disabled={!session}
            />
            {/* Dropdown Custom para Autocompletado desde API */}
            {showDropdown && filters.query.length >= 2 && session && !isPropertyCode(filters.query) && (isSearchingLocation || suggestions.length > 0) && (
              <div
                className="absolute top-[calc(100%+16px)] left-0 right-0 bg-background border border-border rounded-xl shadow-2xl max-h-[196px] overflow-y-auto z-[200] p-2 animate-in fade-in slide-in-from-top-2"
              >
                {isSearchingLocation ? (
                  <div className="px-3 py-4 text-sm text-muted-foreground flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Buscando ubicaciones...</span>
                  </div>
                ) : (
                  suggestions.map((c, idx) => (
                    <div
                      key={c}
                      id={`suggestion-${idx}`}
                      className={cn(
                        "px-3 py-2 text-sm text-foreground rounded-md cursor-pointer transition-colors",
                        idx === selectedIndex ? "bg-muted font-medium" : "hover:bg-muted"
                      )}
                      onClick={() => {
                        setFilters(prev => ({ ...prev, query: c }));
                        setShowDropdown(false);
                        setSelectedIndex(0);
                      }}
                    >
                      {c}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
            <Button type="submit" size="lg" className="h-12 rounded-full px-8 w-full md:w-auto text-[15px] font-semibold" disabled={!session || !filters.query.trim() || gridState === 'loading'}>
              Buscar
            </Button>
          </div>
        </form>
      </section>



      {/* Grid de Resultados o Propiedades Cercanas */}
      {gridState === 'initial' ? (
        <NearbyProperties favoriteIds={favoriteIds} />
      ) : (
        <ResultsGrid
          state={gridState}
          results={results}
          totalResults={totalResults}
          error={errorMsg}
          favoriteIds={favoriteIds}
          onRetry={() => handleSearch(undefined, page)}
          onClearFilters={() => { clearAllFilters(); handleSearch(undefined, 1); }}
          operation={activeFilters.operation}
          propertyType={activeFilters.propertyType}
          locationName={!isPropertyCode(activeFilters.query) && activeFilters.query.includes(',') ? activeFilters.query : undefined}
          page={page}
          onPageChange={handlePageChange}
        />
      )}

    </div>
  );
}
