'use server'

import { scrapePortalInmobiliario } from '@/lib/scraper'
import { requireUserId } from '@/lib/auth-context'
import { getSession } from '@/lib/session'
import { logUserEvent } from './events'
import { recordSearch } from '@/lib/services/search-history'
import { searchLocations } from '@/lib/services/location'
import type { ScrapeResult, SearchFilters } from '@/types/domain'

export async function performSearch(params: SearchFilters): Promise<ScrapeResult> {
  const { userId, sessionId } = await requireUserId();

  // Validar que venga al menos la comuna o el código
  const hasComuna = params.comuna && params.comuna.trim() !== '';
  const hasCode = params.code && params.code.trim() !== '';

  if (!hasComuna && !hasCode) {
    throw new Error('La comuna o el código de propiedad es obligatorio');
  }

  // Guardar historial SOLAMENTE si no es una búsqueda automática de Discovery
  if (params.isDiscovery) {
    return scrapePortalInmobiliario(params);
  }

  await logUserEvent('SCRAPE_START', { params }, { userId, sessionId });

  const results = await scrapePortalInmobiliario(params);

  await recordSearch(userId, params, results.totalResults);

  // Guardar evento final
  await logUserEvent('SCRAPE_SUCCESS', { params, resultsCount: results.totalResults }, { userId, sessionId });

  return results;
}

export async function fetchLocations(query: string): Promise<string[]> {
  const session = await getSession();
  if (!session?.userId) {
    return []; // Return empty suggestions instead of throwing to prevent UI crashes on keydown
  }

  return searchLocations(query);
}
