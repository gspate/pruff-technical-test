'use client';

import * as React from 'react';
import { MapPin } from 'lucide-react';
import { DiscoverySlider } from '@/components/features/discovery/DiscoverySlider';
import { DiscoveryNotice } from '@/components/features/discovery/DiscoveryNotice';

const DISCOVERY_SECTIONS = [
  { title: 'Departamentos a la Venta', operation: 'venta', propertyType: 'departamento' },
  { title: 'Departamentos en Arriendo', operation: 'arriendo', propertyType: 'departamento' },
  { title: 'Casas a la Venta', operation: 'venta', propertyType: 'casa' },
  { title: 'Casas en Arriendo', operation: 'arriendo', propertyType: 'casa' },
];

export function NearbyProperties({ favoriteIds = [] }: { favoriteIds?: string[] }) {
  const [comuna, setComuna] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const requestLocation = React.useCallback(() => {
    setLoading(true);
    setError(null);
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);
            const data = await res.json();
            const address = data.address || {};
            const detectedComuna = address.suburb || address.city_district || address.town || address.city || address.municipality || address.village || address.county || 'Santiago';
            setComuna(`${detectedComuna}, RM (Metropolitana)`);
          } catch {
            setError('No pudimos buscar propiedades en tu ubicación. Reintenta más tarde.');
          } finally {
            setLoading(false);
          }
        },
        () => {
          setError('Comparte tu ubicación con nosotros para ver las mejores propiedades cerca de ti.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocalización no soportada en este navegador.');
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  if (error) {
    return (
      <DiscoveryNotice 
        message={error} 
        actionLabel="Solicitar Ubicación"
        onAction={requestLocation}
      />
    );
  }

  if (loading || !comuna) {
    return (
      <div className="mt-8 text-center text-muted-foreground py-16">
        <MapPin className="w-8 h-8 mx-auto mb-4 animate-bounce text-primary" />
        <p className="text-lg font-medium animate-pulse">Obteniendo tu ubicación para descubrir propiedades...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 mt-4 pb-12">
      {DISCOVERY_SECTIONS.map((section) => (
        <DiscoverySlider
          key={section.title}
          title={section.title}
          comuna={comuna}
          operation={section.operation}
          propertyType={section.propertyType}
          favoriteIds={favoriteIds}
        />
      ))}
    </div>
  );
}
