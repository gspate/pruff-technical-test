export interface PropertyData {
  title: string;
  price: string;
  imageUrl: string | null;
  url: string;
  externalId: string;
}

export interface ScrapeResult {
  properties: PropertyData[];
  totalResults: number;
}

// Nota: se declara como `type` (no `interface`) para conservar el índice de firma implícito
// que TypeScript otorga a los literales de tipo, requerido para que sea asignable a los
// campos Json de Prisma sin casts adicionales (los `interface` no reciben ese índice implícito).
export type SearchFilters = {
  comuna?: string;
  operation?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  code?: string;
  isDiscovery?: boolean;
  page?: number;
}

export interface SessionPayload {
  userId: string;
  email: string;
  name?: string | null;
  sessionId?: string;
  expires?: Date;
}

export type EventType =
  | 'LOGIN'
  | 'SCRAPE_START'
  | 'SCRAPE_SUCCESS'
  | 'FAVORITE_ADD'
  | 'FAVORITE_REMOVE'
  | 'CLICK_RESULT';

export interface SessionUser {
  email?: string | null;
  name?: string | null;
  userId?: string | null;
}
