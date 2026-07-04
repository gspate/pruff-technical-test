import * as cheerio from 'cheerio';
import type { PropertyData, ScrapeResult, SearchFilters } from '@/types/domain';

export const PORTAL_USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

/**
 * Función de rescate: Implementa Exponential Backoff con Jitter
 * Si el portal sufre una caída temporal (503, 504), reintentará progresivamente.
 */
async function fetchWithRetry(url: string, headers: any, maxRetries = 3): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(url, { headers });
    
    // Si es éxito, o un bloqueo definitivo (403/429), no reintentamos
    if (response.ok || response.status === 403 || response.status === 429) {
      return response;
    }

    // Si es un error temporal del portal, aplicamos Exponential Backoff + Jitter
    if (i < maxRetries - 1) {
      const delay = Math.pow(2, i) * 1000 + Math.random() * 500; // 1s, 2s, 4s + ms aleatorios
      console.warn(`[Scraper] Portal falló con HTTP ${response.status}. Reintentando en ${Math.round(delay)}ms... (Intento ${i + 1}/${maxRetries})`);
      await new Promise(res => setTimeout(res, delay));
    } else {
      return response; // Devolvemos el error si agotamos intentos
    }
  }
  throw new Error("Unreachable");
}

export async function scrapePortalInmobiliario({
  comuna,
  operation = 'venta',
  propertyType = 'departamento',
  code,
  page = 1
}: SearchFilters): Promise<ScrapeResult> {
  let url = '';

  if (code) {
    url = `https://listado.portalinmobiliario.com/${code}`;
  } else if (comuna) {
    const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    
    const parts = comuna.split(',');
    const comunaName = normalize(parts[0]).replace(/[^a-z0-9]+/g, '-');
    let regionName = 'metropolitana'; // default

    if (parts.length > 1) {
      const r = normalize(parts[1]);
      if (r.includes('rm') || r.includes('metropolitana')) {
        regionName = 'metropolitana';
      } else {
        regionName = r.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      }
    }

    let searchSlug = `${operation}/${propertyType.toLowerCase()}/${comunaName}-${regionName}`;
    
    const filterSuffixes: string[] = [];
    
    if (page > 1) {
      const offset = (page - 1) * 48 + 1;
      filterSuffixes.push(`Desde_${offset}_NoIndex_True`);
    }

    if (filterSuffixes.length > 0) {
      searchSlug += `/_${filterSuffixes.join('_')}`;
    }

    url = `https://www.portalinmobiliario.com/${searchSlug}`;
  } else {
    throw new Error('Debe proveer una comuna o un código de propiedad');
  }

  const headers = {
    'User-Agent': PORTAL_USER_AGENT,
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'es-CL,es;q=0.9',
    'Cache-Control': 'no-cache',
  };

  try {
    // Reemplazamos fetch por nuestro envoltorio robusto de reintentos
    const response = await fetchWithRetry(url, headers);
    if (!response.ok) {
      if (response.status === 403 || response.status === 429) {
        throw new Error(`Bloqueado por el portal (HTTP ${response.status}). Se requiere fallback a Playwright o Proxies.`);
      }
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    const properties: PropertyData[] = [];

    $('.poly-card').each((_, el) => {
      const item = $(el);
      const title = item.find('.poly-component__title').text().trim();
      
      const priceElement = item.find('.andes-money-amount__fraction');
      const priceSymbol = item.find('.andes-money-amount__currency-symbol').text().trim();
      const priceValue = priceElement.first().text().trim();
      
      const price = priceSymbol && priceValue 
        ? `${priceSymbol} ${priceValue}` 
        : item.find('.poly-component__price').text().trim() || 'Precio a consultar';
      
      const link = item.find('.poly-component__title').attr('href') || item.find('a').attr('href');
      
      const imgEl = item.find('.poly-component__picture img, .poly-card__portada img');
      const imageUrl = imgEl.attr('data-src') || imgEl.attr('src') || null;

      let externalId = '';
      if (link) {
        const idMatch = link.match(/MLC-?\d+/i);
        if (idMatch) {
          externalId = idMatch[0].replace('-', '');
        }
      }

      if (title && link) {
        properties.push({
          title,
          price,
          imageUrl,
          url: link,
          externalId: externalId || `fallback-${Math.random().toString(36).substring(7)}`,
        });
      }
    });

    // Deduplicar priorizando aquellas cuyo externalId inicie con MLC
    const propertyMap = new Map<string, PropertyData[]>();
    for (const prop of properties) {
      const key = `${prop.title}-${prop.price}`;
      if (!propertyMap.has(key)) propertyMap.set(key, []);
      propertyMap.get(key)!.push(prop);
    }

    const finalProperties: PropertyData[] = [];
    for (const group of propertyMap.values()) {
      if (group.length > 1) {
        const mlcItem = group.find(p => p.externalId.startsWith('MLC'));
        finalProperties.push(mlcItem || group[0]);
      } else {
        finalProperties.push(group[0]);
      }
    }

    let totalResults = finalProperties.length;
    const totalResultsText = $('.ui-search-search-result__quantity-results').text();
    if (totalResultsText) {
      const num = parseInt(totalResultsText.replace(/\D/g, ''), 10);
      if (!isNaN(num)) {
        totalResults = num;
      }
    }

    return { properties: finalProperties, totalResults };
  } catch (error) {
    console.error('Error in scrapePortalInmobiliario:', error);
    throw error;
  }
}
