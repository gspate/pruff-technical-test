'use client';

import * as React from 'react';
import { performSearch } from '@/app/actions/search';
import type { PropertyData } from '@/types/domain';
import { PropertyCard } from '@/components/features/property/PropertyCard';
import { PropertyCardSkeleton } from '@/components/features/property/PropertyCardSkeleton';
import { MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArrow } from '@/components/features/discovery/ScrollArrow';
import { DiscoveryNotice } from '@/components/features/discovery/DiscoveryNotice';

interface DiscoverySliderProps {
  title: string;
  comuna: string;
  operation: string;
  propertyType: string;
  favoriteIds?: string[];
}

const SCROLL_DISTANCE = 1032;

export function DiscoverySlider({ title, comuna, operation, propertyType, favoriteIds = [] }: DiscoverySliderProps) {
  const [properties, setProperties] = React.useState<PropertyData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const updateScrollState = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  React.useEffect(() => {
    let mounted = true;

    const fetchProperties = async () => {
      try {
        setLoading(true);
        const props = await performSearch({
          comuna,
          operation,
          propertyType,
          isDiscovery: true // <-- Evita que se guarde en historial
        });

        if (mounted) {
          setProperties(props.properties.slice(0, 12));
          setTimeout(updateScrollState, 100);
        }
      } catch {
        if (mounted) setError(`No pudimos cargar ${title.toLowerCase()}.`);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProperties();

    return () => { mounted = false; };
  }, [comuna, operation, propertyType, title]);

  const scrollByDistance = (distance: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: distance, behavior: 'smooth' });
    }
  };

  if (error) {
    return <DiscoveryNotice message={error} />;
  }

  if (loading) {
    return (
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            {title} <span className="text-muted-foreground font-normal text-lg">({comuna})</span>
          </h2>
        </div>
        <div className="flex overflow-hidden gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <PropertyCardSkeleton key={i} variant="slider" />
          ))}
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 relative group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            {title} <span className="text-muted-foreground font-normal text-lg">({comuna})</span>
          </h2>
        </div>
      </div>

      {/* Carrusel Horizontal (Slider) con flechas superpuestas */}
      <div className="relative group/slider">
        {canScrollLeft && <ScrollArrow direction="left" onClick={() => scrollByDistance(-SCROLL_DISTANCE)} />}
        {canScrollRight && <ScrollArrow direction="right" onClick={() => scrollByDistance(SCROLL_DISTANCE)} />}

        <div
          ref={scrollContainerRef}
          onScroll={updateScrollState}
          className="flex overflow-x-auto gap-6 pb-6 pt-2 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {properties.map((prop, idx) => (
            <div key={prop.externalId || idx} className="w-[300px] sm:w-[320px] shrink-0 snap-start">
              <PropertyCard
                property={prop}
                operation={operation}
                initialIsFavorite={favoriteIds.includes(prop.externalId)}
              />
            </div>
          ))}

          {/* Tarjeta "Ver Todos" */}
          <div className="min-w-[280px] md:min-w-[320px] snap-start flex-shrink-0 flex items-stretch p-0 py-1 pr-4">
            <Button
              variant="outline"
              className="w-full h-full flex flex-col items-center justify-center gap-4 bg-muted/30 hover:bg-muted border-dashed rounded-[var(--radius)] shadow-sm hover:shadow-[var(--shadow-soft)] transition-all whitespace-normal text-center p-6 cursor-pointer"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center shadow-sm shrink-0">
                <ArrowRight className="w-6 h-6 text-primary" />
              </div>
              <span className="font-semibold text-[16px]">Ver todo en {comuna}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
