'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { performSearch, fetchLocations } from '@/app/actions/search';
import { isPropertyCode } from '@/lib/formatters';
import type { GridState } from '@/components/features/search/ResultsGrid';
import type { PropertyData, SessionUser } from '@/types/domain';

export type SearchFiltersState = {
  query: string; // Comuna o código
  operation: string;
  propertyType: string;
};

const DEFAULT_FILTERS: SearchFiltersState = {
  query: '',
  operation: 'venta',
  propertyType: 'departamento',
};

export function useSearch(session: SessionUser | null) {
  const [filters, setFilters] = React.useState<SearchFiltersState>(DEFAULT_FILTERS);
  const [activeFilters, setActiveFilters] = React.useState<SearchFiltersState>(DEFAULT_FILTERS);
  const [page, setPage] = React.useState(1);
  const [gridState, setGridState] = React.useState<GridState>('initial');
  const [results, setResults] = React.useState<PropertyData[] | null>(null);
  const [totalResults, setTotalResults] = React.useState<number>(0);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Autocomplete state
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = React.useState(false);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const searchParams = useSearchParams();

  React.useEffect(() => {
    if (!session) return;
    const q = searchParams?.get('query');
    const op = searchParams?.get('op');
    const type = searchParams?.get('type');

    if (q) {
      const operation = op || 'venta';
      const propertyType = type || 'departamento';

      setFilters({ query: q, operation, propertyType });
      setActiveFilters({ query: q, operation, propertyType });

      const load = async () => {
        setGridState('loading');
        try {
          const isCode = isPropertyCode(q);
          const data = await performSearch({
            comuna: !isCode ? q : undefined,
            code: isCode ? q : undefined,
            operation,
            propertyType,
            page: 1,
          });

          if (data.properties.length === 0) {
            setGridState('empty');
            setTotalResults(0);
          } else {
            setResults(data.properties);
            setTotalResults(data.totalResults);
            setGridState('success');
          }
        } catch (err) {
          setErrorMsg(err instanceof Error ? err.message : 'Error de conexión');
          setGridState('error');
        }
      };

      load();
    }
     
  }, [session, searchParams]);


  // Debounce API calls for location autocomplete
  React.useEffect(() => {
    if (!session) return;
    const timer = setTimeout(async () => {
      if (filters.query.length >= 2 && !isPropertyCode(filters.query)) {
        setIsSearchingLocation(true);
        const locs = await fetchLocations(filters.query);
        setSuggestions(locs);
        setSelectedIndex(0);
        setIsSearchingLocation(false);
      } else {
        setSuggestions([]);
        setSelectedIndex(0);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.query, session]);

  const handleSearch = async (e?: React.FormEvent, targetPage: number = 1) => {
    if (e) e.preventDefault();
    if (!session) return;

    let queryToSearch = filters.query.trim();
    if (!queryToSearch) return;

    const isCode = isPropertyCode(queryToSearch);

    // Autocompletar la comuna si el usuario no escribió el nombre exacto
    if (!isCode) {
      const exactMatch = suggestions.find((s) => s.toLowerCase() === queryToSearch.toLowerCase());
      if (!exactMatch) {
        if (showDropdown && suggestions.length > 0) {
          // Si ya tenemos sugerencias (escribió lento)
          queryToSearch = suggestions[selectedIndex] || suggestions[0];
          setFilters((prev) => ({ ...prev, query: queryToSearch }));
        } else {
          // Si escribió muy rápido y apretó Enter antes de tener sugerencias
          setGridState('loading'); // Feedback visual inmediato
          try {
            const locs = await fetchLocations(queryToSearch);
            if (locs.length > 0) {
              queryToSearch = locs[0];
              setFilters((prev) => ({ ...prev, query: queryToSearch }));
            }
          } catch {
            // Continuar con el texto original en caso de fallo
          }
        }
      }
    }

    setShowDropdown(false);
    setGridState('loading');
    setErrorMsg(null);
    if (targetPage === 1) {
      setResults(null);
    }
    setActiveFilters({ ...filters, query: queryToSearch });
    setPage(targetPage);

    try {
      const isCode = isPropertyCode(queryToSearch);

      const data = await performSearch({
        comuna: !isCode ? queryToSearch : undefined,
        code: isCode ? queryToSearch : undefined,
        operation: filters.operation,
        propertyType: filters.propertyType,
        page: targetPage,
      });

      if (data.properties.length === 0) {
        setGridState('empty');
        setTotalResults(0);
      } else {
        setResults(data.properties);
        setTotalResults(data.totalResults);
        setGridState('success');
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error de conexión');
      setGridState('error');
    }
  };

  // Actualizar el título de la pestaña del navegador dinámicamente
  React.useEffect(() => {
    if (gridState === 'initial') {
      document.title = 'PropertyFinder';
    } else {
      const type = activeFilters.propertyType.charAt(0).toUpperCase() + activeFilters.propertyType.slice(1);
      const op = activeFilters.operation === 'venta' ? 'Venta' : 'Arriendo';
      const loc = activeFilters.query && activeFilters.query.includes(',') ? ` en ${activeFilters.query}` : '';
      document.title = `${type} en ${op}${loc} | PropertyFinder`;
    }
  }, [gridState, activeFilters]);

  const handlePageChange = (newPage: number) => {
    handleSearch(undefined, newPage);
  };

  const clearAllFilters = () => {
    setFilters({ ...DEFAULT_FILTERS, query: filters.query });
  };

  return {
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
  };
}
