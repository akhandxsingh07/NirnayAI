import type { Express, Request, Response } from 'express';

type PlaceKind = 'competitor' | 'customer' | 'opportunity';

type LivePlace = {
  id: string;
  name: string;
  kind: PlaceKind;
  lat: number;
  lng: number;
  distanceKm: number;
  category: string;
  tags: Record<string, string>;
};

type LiveMapPayload = {
  center: {
    lat: number;
    lng: number;
    label: string;
    source: 'live-location' | 'district';
  };
  radiusKm: number;
  updatedAt: string;
  places: LivePlace[];
  stats: {
    totalPlaces: number;
    competitors: number;
    customerHubs: number;
    opportunityHubs: number;
    nearestCompetitorKm: number | null;
    competitorDensity: 'Low' | 'Moderate' | 'High';
  };
  coverageNote: string;
};

type CacheEntry = { expiresAt: number; value: LiveMapPayload };
const CACHE_TTL_MS = 5 * 60 * 1000;
const cache = new Map<string, CacheEntry>();

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const earthKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  return earthKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

type Selector = { key: string; values: string[] };

function competitorSelectors(category: string): Selector[] {
  const normalized = category.toLowerCase();
  if (normalized.includes('dairy')) return [{ key: 'shop', values: ['dairy'] }];
  if (normalized.includes('food')) return [
    { key: 'shop', values: ['bakery', 'deli'] },
    { key: 'craft', values: ['bakery'] },
  ];
  if (normalized.includes('retail')) return [{ key: 'shop', values: ['convenience', 'supermarket', 'general'] }];
  if (normalized.includes('agriculture')) return [
    { key: 'shop', values: ['agrarian', 'farm'] },
    { key: 'craft', values: ['agricultural_engines'] },
  ];
  if (normalized.includes('poultry')) return [{ key: 'shop', values: ['butcher'] }];
  if (normalized.includes('tailor')) return [
    { key: 'craft', values: ['tailor'] },
    { key: 'shop', values: ['clothes', 'fabric'] },
  ];
  if (normalized.includes('handicraft')) return [{ key: 'shop', values: ['craft', 'gift'] }];
  if (normalized.includes('repair')) return [
    { key: 'shop', values: ['mobile_phone', 'electronics', 'car_repair', 'bicycle'] },
    { key: 'craft', values: ['electrician'] },
  ];
  if (normalized.includes('manufacturing')) return [{ key: 'landuse', values: ['industrial'] }];
  return [{ key: 'shop', values: ['convenience', 'supermarket', 'general'] }];
}

const CUSTOMER_SELECTORS: Selector[] = [
  { key: 'amenity', values: ['marketplace', 'school', 'college', 'hospital', 'clinic', 'bank', 'bus_station'] },
  { key: 'shop', values: ['supermarket', 'convenience', 'mall'] },
];

const OPPORTUNITY_SELECTORS: Selector[] = [
  { key: 'amenity', values: ['marketplace'] },
  { key: 'landuse', values: ['industrial', 'commercial'] },
];

function matches(tags: Record<string, string>, selectors: Selector[]) {
  return selectors.some((selector) => selector.values.includes(tags[selector.key]));
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function selectorToOverpass(selector: Selector, radius: number, lat: number, lng: number) {
  const regex = selector.values.map(escapeRegex).join('|');
  return `nwr(around:${radius},${lat},${lng})["${selector.key}"~"^(${regex})$"];`;
}

function readableCategory(tags: Record<string, string>) {
  const raw = tags.shop || tags.amenity || tags.craft || tags.landuse || tags.tourism || 'place';
  return raw.replaceAll('_', ' ');
}

function readableName(tags: Record<string, string>) {
  return tags.name || tags.brand || tags.operator || readableCategory(tags).replace(/\b\w/g, (m) => m.toUpperCase());
}

async function geocodeDistrict(district: string, state: string) {
  const query = [district, state, 'India'].filter(Boolean).join(', ');
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('limit', '1');
  url.searchParams.set('countrycodes', 'in');
  url.searchParams.set('q', query);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'NirnayAI/1.0 (+https://github.com/akhandxsingh07/NirnayAI)',
        'Accept-Language': 'en-IN,en;q=0.8',
      },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Geocoding failed with ${response.status}`);
    const rows = (await response.json()) as Array<{ lat?: string; lon?: string; display_name?: string }>;
    const first = rows[0];
    if (!first?.lat || !first?.lon) return null;
    return {
      lat: Number(first.lat),
      lng: Number(first.lon),
      label: first.display_name || query,
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchOverpass(lat: number, lng: number, radiusMeters: number, category: string) {
  const selectors = [...competitorSelectors(category), ...CUSTOMER_SELECTORS, ...OPPORTUNITY_SELECTORS];
  const unique = new Map(selectors.map((selector) => [`${selector.key}:${selector.values.join(',')}`, selector]));
  const body = Array.from(unique.values())
    .map((selector) => selectorToOverpass(selector, radiusMeters, lat, lng))
    .join('\n');

  const query = `[out:json][timeout:18];\n(\n${body}\n);\nout center tags;`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'User-Agent': 'NirnayAI/1.0 (+https://github.com/akhandxsingh07/NirnayAI)',
      },
      body: new URLSearchParams({ data: query }).toString(),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Map data failed with ${response.status}`);
    return (await response.json()) as {
      elements?: Array<{
        type: string;
        id: number;
        lat?: number;
        lon?: number;
        center?: { lat?: number; lon?: number };
        tags?: Record<string, string>;
      }>;
    };
  } finally {
    clearTimeout(timeout);
  }
}

export function registerLiveMapRoutes(app: Express) {
  app.get('/api/map/analyze', async (req: Request, res: Response) => {
    const district = String(req.query.district || '').trim();
    const state = String(req.query.state || 'Uttar Pradesh').trim();
    const category = String(req.query.category || 'Other').trim();
    const requestedRadiusKm = Number(req.query.radiusKm || 5);
    const radiusKm = clamp(Number.isFinite(requestedRadiusKm) ? requestedRadiusKm : 5, 2, 10);

    const requestedLat = Number(req.query.lat);
    const requestedLng = Number(req.query.lng);
    const hasLiveCoordinates = Number.isFinite(requestedLat) && Number.isFinite(requestedLng);

    try {
      let lat = requestedLat;
      let lng = requestedLng;
      let label = district || 'Selected area';
      let source: LiveMapPayload['center']['source'] = 'live-location';

      if (!hasLiveCoordinates) {
        if (!district) return res.status(400).json({ error: 'District or live coordinates are required.' });
        const geocoded = await geocodeDistrict(district, state);
        if (!geocoded) return res.status(404).json({ error: 'Could not locate the selected district.' });
        lat = geocoded.lat;
        lng = geocoded.lng;
        label = geocoded.label;
        source = 'district';
      }

      const cacheKey = `${lat.toFixed(3)}:${lng.toFixed(3)}:${radiusKm}:${category.toLowerCase()}`;
      const cached = cache.get(cacheKey);
      if (cached && cached.expiresAt > Date.now()) return res.json(cached.value);

      const raw = await fetchOverpass(lat, lng, Math.round(radiusKm * 1000), category);
      const competitors = competitorSelectors(category);
      const dedupe = new Set<string>();
      const places: LivePlace[] = [];

      for (const element of raw.elements || []) {
        const pointLat = element.lat ?? element.center?.lat;
        const pointLng = element.lon ?? element.center?.lon;
        if (!Number.isFinite(pointLat) || !Number.isFinite(pointLng)) continue;
        const tags = element.tags || {};
        const name = readableName(tags);
        const dedupeKey = `${name.toLowerCase()}:${Number(pointLat).toFixed(4)}:${Number(pointLng).toFixed(4)}`;
        if (dedupe.has(dedupeKey)) continue;
        dedupe.add(dedupeKey);

        let kind: PlaceKind = 'customer';
        if (matches(tags, competitors)) kind = 'competitor';
        else if (matches(tags, OPPORTUNITY_SELECTORS)) kind = 'opportunity';

        places.push({
          id: `${element.type}-${element.id}`,
          name,
          kind,
          lat: Number(pointLat),
          lng: Number(pointLng),
          distanceKm: Number(distanceKm(lat, lng, Number(pointLat), Number(pointLng)).toFixed(2)),
          category: readableCategory(tags),
          tags,
        });
      }

      places.sort((a, b) => a.distanceKm - b.distanceKm);
      const limitedPlaces = places.slice(0, 80);
      const competitorPlaces = limitedPlaces.filter((place) => place.kind === 'competitor');
      const customerHubs = limitedPlaces.filter((place) => place.kind === 'customer');
      const opportunityHubs = limitedPlaces.filter((place) => place.kind === 'opportunity');
      const competitorCount = competitorPlaces.length;

      const payload: LiveMapPayload = {
        center: { lat, lng, label, source },
        radiusKm,
        updatedAt: new Date().toISOString(),
        places: limitedPlaces,
        stats: {
          totalPlaces: limitedPlaces.length,
          competitors: competitorCount,
          customerHubs: customerHubs.length,
          opportunityHubs: opportunityHubs.length,
          nearestCompetitorKm: competitorPlaces[0]?.distanceKm ?? null,
          competitorDensity: competitorCount >= 12 ? 'High' : competitorCount >= 5 ? 'Moderate' : 'Low',
        },
        coverageNote: 'Live OpenStreetMap/Overpass data can be incomplete in some rural areas. Use it as decision support and verify important places locally.',
      };

      cache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, value: payload });
      if (cache.size > 60) {
        const firstKey = cache.keys().next().value as string | undefined;
        if (firstKey) cache.delete(firstKey);
      }

      return res.json(payload);
    } catch (error) {
      console.error('Live map analysis failed:', error);
      return res.status(502).json({
        error: 'Live map service is temporarily unavailable. Please retry in a moment.',
      });
    }
  });
}
