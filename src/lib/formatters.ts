// Un query se interpreta como código de propiedad (vs. nombre de comuna) si contiene dígitos o guiones.
export function isPropertyCode(query: string): boolean {
  return /[\d-]/.test(query);
}

export function getInitial(nameOrEmail: string): string {
  return nameOrEmail.charAt(0).toUpperCase();
}

export function getDisplayName(user: { name?: string | null; email: string }): string {
  return user.name || user.email.split('@')[0] || 'Usuario';
}

export function parseJson<T>(value: unknown): T {
  return (typeof value === 'string' ? JSON.parse(value) : value) as T;
}

interface SearchFiltersLike {
  operation?: string;
  propertyType?: string;
  comuna?: string;
}

// Replica el fallback usado en history/page.tsx y run-daily-report/route.ts para describir una búsqueda guardada.
export function describeSearch(filters: SearchFiltersLike | null | undefined, queryText?: string | null) {
  return {
    operation: filters?.operation || 'Venta',
    propertyType: filters?.propertyType || 'Propiedad',
    location: queryText?.replace('Búsqueda en ', '') || filters?.comuna || 'Ubicación desconocida',
  };
}
