'use client';

import * as React from 'react';
import { Heart, ImageOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { PropertyData } from '@/types/domain';
import { logUserEvent } from '@/app/actions/events';
import { toggleFavorite } from '@/app/actions/favorites';
import { getOperationBadgeLabel } from '@/constants/labels';

interface PropertyCardProps {
  property: PropertyData;
  operation?: string; // Venta o Arriendo para el badge
  initialIsFavorite?: boolean;
}

export function PropertyCard({ property, operation = 'Venta', initialIsFavorite = false }: PropertyCardProps) {
  const [imageError, setImageError] = React.useState(false);
  const [isFavorite, setIsFavorite] = React.useState(initialIsFavorite);

  // Formateo del precio: Asume que viene como "$ 180.000.000" o "UF 4.200"
  // El scraper ya lo extrae formateado, pero aplicamos tabular-nums via CSS class
  
  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Evitar navegar a la tarjeta
    setIsFavorite(!isFavorite); // Optimistic UI
    
    try {
      await toggleFavorite(property);
    } catch (err) {
      // Revertir si falla
      setIsFavorite(!isFavorite);
      console.error('Error toggling favorite:', err);
    }
  };

  const handleCardClick = () => {
    // Log the event silently in the background
    logUserEvent('CLICK_RESULT', { 
      url: property.url, 
      title: property.title,
      externalId: property.externalId 
    });
  };

  return (
    <article
      className="group flex flex-col bg-background rounded-[var(--radius)] border border-border shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden cursor-pointer"
    >
      {/* Contenedor de Imagen 4/3 */}
      <div className="relative w-full aspect-4/3 bg-muted overflow-hidden">
        {/* Badge de Operación */}
        <div className="absolute top-3 left-3 z-20">
          <Badge className="bg-background/90 text-foreground backdrop-blur-sm shadow-sm hover:bg-background">
            {getOperationBadgeLabel(operation)}
          </Badge>
        </div>

        {/* Botón Favorito Flotante */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 z-20 p-2 bg-background/80 hover:bg-background backdrop-blur-sm rounded-full shadow-sm transition-all active:scale-95 cursor-pointer"
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-colors duration-200",
              isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
            )}
          />
        </button>

        {/* Imagen con Skeleton (simplificado para evitar bug de caché) */}
        {!imageError ? (
          <>
            {property.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={property.imageUrl}
                alt={`Imagen de ${property.title}`}
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03] z-10"
              />
            )}
            {!property.imageUrl && (
               <div className="absolute inset-0 bg-muted z-0" />
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground z-0">
            <ImageOff className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-xs font-medium">Sin imagen</span>
          </div>
        )}
      </div>

      {/* Contenido (Padding 16px) */}
      <div className="p-4 flex flex-col flex-1 gap-2 relative z-10">
        {/* Enlace estirado (Stretched Link) */}
        <a 
          href={property.url} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={handleCardClick}
          className="absolute inset-0 z-0"
          aria-label={`Ver detalles de ${property.title}`}
        >
          <span className="sr-only">{property.title}</span>
        </a>
        
        {/* Precio (Protagonista) */}
        <div className="text-[24px] font-bold text-foreground leading-tight tracking-tight tabular-nums relative z-10 pointer-events-none">
          {property.price}
        </div>
        
        {/* Título (Secundario) */}
        <h3 className="text-[14px] font-medium text-foreground/90 line-clamp-2 leading-snug relative z-10 pointer-events-none">
          {property.title}
        </h3>
        
        {/* Metadata (Terciaria) - Mock ya que el scraper base no lo trae detallado */}
        <div className="mt-auto pt-2 flex items-center gap-3 text-[12px] text-muted-foreground font-normal relative z-10 pointer-events-none">
          <span className="truncate">Cód: {property.externalId}</span>
        </div>
      </div>
    </article>
  );
}
