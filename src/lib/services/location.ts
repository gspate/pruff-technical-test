import { PORTAL_USER_AGENT } from '@/lib/scraper';

export async function searchLocations(query: string): Promise<string[]> {
  if (!query || query.length < 2) return [];

  try {
    const response = await fetch(
      `https://www.portalinmobiliario.com/faceted-search/MLC/RE/searchbox/LOCATION?LOCATION=${encodeURIComponent(query)}`,
      {
        headers: {
          'User-Agent': PORTAL_USER_AGENT,
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) return [];

    const data = await response.json();
    return data.map((item: any) => item.label);
  } catch (err) {
    console.error('Error fetching locations:', err);
    return [];
  }
}
