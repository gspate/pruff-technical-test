export interface SelectOption {
  value: string;
  label: string;
  sentenceLabel: string;
}

// Fuente única de verdad para operación: alimenta el <select> y los formateadores de texto.
export const OPERATIONS: SelectOption[] = [
  { value: 'venta', label: 'Venta', sentenceLabel: 'a la venta' },
  { value: 'arriendo', label: 'Arriendo', sentenceLabel: 'en arriendo' },
  { value: 'arriendo-temporal', label: 'Arriendo temporal', sentenceLabel: 'en arriendo temporal' },
];

// Fuente única de verdad para tipo de propiedad: alimenta el <select> y los formateadores de texto.
export const PROPERTY_TYPES: SelectOption[] = [
  { value: 'departamento', label: 'Departamentos', sentenceLabel: 'departamentos' },
  { value: 'casa', label: 'Casas', sentenceLabel: 'casas' },
  { value: 'oficina', label: 'Oficinas', sentenceLabel: 'oficinas' },
  { value: 'parcela', label: 'Parcelas', sentenceLabel: 'parcelas' },
  { value: 'terreno-en-construccion', label: 'Terrenos', sentenceLabel: 'terrenos en construcción' },
  { value: 'comercial', label: 'Locales', sentenceLabel: 'locales comerciales' },
  { value: 'sitio', label: 'Sitios', sentenceLabel: 'sitios' },
  { value: 'bodega', label: 'Bodegas', sentenceLabel: 'bodegas' },
  { value: 'industrial', label: 'Industriales', sentenceLabel: 'industriales' },
  { value: 'agricola', label: 'Agrícolas', sentenceLabel: 'agrícolas' },
  { value: 'otros', label: 'Otros Inmuebles', sentenceLabel: 'otros inmuebles' },
  { value: 'estacionamiento', label: 'Estacionamientos', sentenceLabel: 'estacionamientos' },
  { value: 'loteo', label: 'Loteos', sentenceLabel: 'loteos' },
];

// Replica el comportamiento exacto de ResultsGrid.getOperationText (incluye fallback genérico).
export function getOperationSentence(operation?: string): string {
  const match = OPERATIONS.find((o) => o.value === operation);
  if (match) return match.sentenceLabel;
  return operation ? `en ${operation}` : '';
}

// Replica el comportamiento exacto de ResultsGrid.getPropertyTypeText (incluye fallback genérico).
export function getPropertyTypeSentence(propertyType?: string): string {
  if (!propertyType) return 'propiedades';
  const match = PROPERTY_TYPES.find((p) => p.value === propertyType);
  return match?.sentenceLabel || 'propiedades';
}

// Replica el comportamiento exacto del badge en PropertyCard (venta/arriendo mapeados, resto pasa tal cual).
export function getOperationBadgeLabel(operation?: string): string {
  if (operation === 'venta') return 'Venta';
  if (operation === 'arriendo') return 'Arriendo';
  return operation ?? '';
}
