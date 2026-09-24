export type LivePlaceKind = 'competitor' | 'customer' | 'opportunity';

export interface LiveMarketPlace {
  id: string;
  name: string;
  kind: LivePlaceKind;
  lat: number;
  lng: number;
  distanceKm: number;
  category: string;
  tags: Record<string, string>;
}

export interface LiveMarketAnalysis {
  center: {
    lat: number;
    lng: number;
    label: string;
    source: 'live-location' | 'provided-location' | 'district';
  };
  radiusKm: number;
  updatedAt: string;
  places: LiveMarketPlace[];
  stats: {
    totalPlaces: number;
    competitors: number;
    customerHubs: number;
    opportunityHubs: number;
    nearestCompetitorKm: number | null;
    competitorDensity: 'Unknown' | 'Low' | 'Moderate' | 'High';
  };
  coverageStatus: 'complete' | 'empty' | 'unavailable';
  coverageNote: string;
}

export interface LiveMarketRequest {
  district: string;
  state: string;
  category: string;
  radiusKm?: number;
  lat?: number;
  lng?: number;
  locationLabel?: string;
  coordinateSource?: 'provided-location' | 'live-location';
}

type Selector = { key: string; values: string[] };

type OverpassElement = {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat?: number; lon?: number };
  tags?: Record<string, string>;
};

const KNOWN_DISTRICT_CENTERS: Record<string, { lat: number; lng: number }> = {
  lucknow: { lat: 26.986, lng: 80.929 },
  'kanpur nagar': { lat: 26.843, lng: 80.063 },
  kanpur: { lat: 26.843, lng: 80.063 },
  prayagraj: { lat: 25.548, lng: 82.089 },
  varanasi: { lat: 25.491, lng: 82.858 },
  ayodhya: { lat: 26.747, lng: 81.989 },
  barabanki: { lat: 27.036, lng: 81.166 },
  sitapur: { lat: 27.291, lng: 81.118 },
  unnao: { lat: 26.616, lng: 80.656 },
  'rae bareli': { lat: 26.165, lng: 80.966 },
  raebareli: { lat: 26.165, lng: 80.966 },
  hardoi: { lat: 27.069, lng: 80.514 },
  sultanpur: { lat: 26.206, lng: 82.197 },
  'lakhimpur kheri': { lat: 28.078, lng: 80.47 },
  lakhimpur: { lat: 28.078, lng: 80.47 },
  bahraich: { lat: 27.864, lng: 81.5 },
  gorakhpur: { lat: 26.827, lng: 83.526 },
  agra: { lat: 27.178, lng: 77.756 },
};

export function knownDistrictCenter(district: string) {
  return KNOWN_DISTRICT_CENTERS[district.trim().toLowerCase()] || null;
}

const CUSTOMER_SELECTORS: Selector[] = [
  { key: 'amenity', values: ['marketplace', 'school', 'college', 'hospital', 'clinic', 'bank', 'bus_station'] },
  { key: 'shop', values: ['supermarket', 'convenience', 'mall'] },
];

const OPPORTUNITY_SELECTORS: Selector[] = [
  { key: 'amenity', values: ['marketplace'] },
  { key: 'landuse', values: ['industrial', 'commercial'] },
];

function competitorSelectors(category: string): Selector[] {
  const c = category.toLowerCase();
  if (c.includes('dairy')) return [{ key: 'shop', values: ['dairy'] }];
  if (c.includes('food')) return [{ key: 'shop', values: ['bakery', 'deli', 'confectionery'] }, { key: 'craft', values: ['bakery'] }];
  if (c.includes('retail')) return [{ key: 'shop', values: ['convenience', 'supermarket', 'general'] }];
  if (c.includes('agriculture')) return [{ key: 'shop', values: ['agrarian', 'farm'] }, { key: 'craft', values: ['agricultural_engines'] }];
  if (c.includes('poultry')) return [{ key: 'shop', values: ['butcher', 'farm'] }];
  if (c.includes('tailor')) return [{ key: 'craft', values: ['tailor'] }, { key: 'shop', values: ['clothes', 'fabric'] }];
  if (c.includes('handicraft')) return [{ key: 'shop', values: ['craft', 'gift'] }];
  if (c.includes('repair') || c.includes('electrical')) return [
    { key: 'shop', values: ['mobile_phone', 'electronics', 'car_repair', 'bicycle', 'computer'] },
    { key: 'craft', values: ['electrician', 'electronics_repair'] },
  ];
  if (c.includes('manufacturing') || c.includes('carpentry')) return [{ key: 'landuse', values: ['industrial'] }, { key: 'craft', values: ['carpenter'] }];
  if (c.includes('digital') || c.includes('it')) return [{ key: 'shop', values: ['computer', 'mobile_phone'] }, { key: 'office', values: ['it', 'company'] }];
  return [{ key: 'shop', values: ['convenience', 'supermarket', 'general'] }];
}

function matches(tags: Record<string, string>, selectors: Selector[]) {
  return selectors.some((selector) => selector.values.includes(tags[selector.key]));
}

function readableCategory(tags: Record<string, string>) {
  const raw = tags.shop || tags.amenity || tags.craft || tags.office || tags.landuse || 'place';
  return raw.replaceAll('_', ' ');
}

function readableName(tags: Record<string, string>) {
  return tags.name || tags.brand || tags.operator || readableCategory(tags).replace(/\b\w/g, (m) => m.toUpperCase());
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function selectorToOverpass(selector: Selector, bbox: string) {
  const regex = selector.values.map(escapeRegex).join('|');
  return `nwr["${selector.key}"~"^(${regex})$"](${bbox});`;
}

function boundingBox(lat: number, lng: number, radiusMeters: number) {
  const latitudeSpan = radiusMeters / 111_320;
  const longitudeSpan = radiusMeters / (111_320 * Math.max(0.1, Math.cos(toRadians(lat))));
  return [lat - latitudeSpan, lng - longitudeSpan, lat + latitudeSpan, lng + longitudeSpan]
    .map((value) => value.toFixed(5)).join(',');
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const earthKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  return earthKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function resolveCenter(input: LiveMarketRequest) {
  if (Number.isFinite(input.lat) && Number.isFinite(input.lng)) {
    return { lat: Number(input.lat), lng: Number(input.lng), label: input.locationLabel || input.district || 'Your location', source: input.coordinateSource || 'live-location' };
  }

  const known = KNOWN_DISTRICT_CENTERS[input.district.trim().toLowerCase()];
  if (known) {
    return { ...known, label: `${input.district}, ${input.state}`, source: 'district' as const };
  }

  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('limit', '1');
  url.searchParams.set('countrycodes', 'in');
  url.searchParams.set('q', [input.district, input.state, 'India'].filter(Boolean).join(', '));

  const response = await fetch(url.toString());
  if (!response.ok) throw new Error('Could not locate this district right now. Try “Use my location”.');
  const rows = await response.json() as Array<{ lat?: string; lon?: string; display_name?: string }>;
  const first = rows[0];
  if (!first?.lat || !first?.lon) throw new Error('Could not locate this district right now. Try “Use my location”.');
  return {
    lat: Number(first.lat),
    lng: Number(first.lon),
    label: first.display_name || `${input.district}, ${input.state}`,
    source: 'district' as const,
  };
}

async function fetchBrowserOverpass(lat: number, lng: number, radiusMeters: number, category: string) {
  const selectors = [...competitorSelectors(category), ...CUSTOMER_SELECTORS, ...OPPORTUNITY_SELECTORS];
  const grouped = new Map<string, Set<string>>();
  for (const selector of selectors) {
    const values = grouped.get(selector.key) || new Set<string>();
    selector.values.forEach((value) => values.add(value));
    grouped.set(selector.key, values);
  }
  const bbox = boundingBox(lat, lng, radiusMeters);
  const body = Array.from(grouped, ([key, values]) => selectorToOverpass({ key, values: [...values] }, bbox)).join('\n');
  const query = `[out:json][timeout:22];\n(\n${body}\n);\nout center qt;`;
  const endpoints = [
    'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
    'https://overpass.private.coffee/api/interpreter',
  ];

  let lastError: unknown = null;
  for (const endpoint of endpoints) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 16000);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: new URLSearchParams({ data: query }).toString(),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`Overpass ${response.status}`);
      return await response.json() as { elements?: OverpassElement[] };
    } catch (error) {
      lastError = error;
    } finally {
      window.clearTimeout(timeout);
    }
  }
  throw lastError instanceof Error ? lastError : new Error('OpenStreetMap place feed unavailable');
}

function buildAnalysis(
  input: LiveMarketRequest,
  center: Awaited<ReturnType<typeof resolveCenter>>,
  elements: OverpassElement[],
  degraded: boolean
): LiveMarketAnalysis {
  const competitors = competitorSelectors(input.category);
  const dedupe = new Set<string>();
  const places: LiveMarketPlace[] = [];

  for (const element of elements) {
    const pointLat = element.lat ?? element.center?.lat;
    const pointLng = element.lon ?? element.center?.lon;
    if (!Number.isFinite(pointLat) || !Number.isFinite(pointLng)) continue;
    if (distanceKm(center.lat, center.lng, Number(pointLat), Number(pointLng)) > Math.min(10, Math.max(2, input.radiusKm || 5))) continue;
    const tags = element.tags || {};
    const name = readableName(tags);
    const dedupeKey = `${name.toLowerCase()}:${Number(pointLat).toFixed(4)}:${Number(pointLng).toFixed(4)}`;
    if (dedupe.has(dedupeKey)) continue;
    dedupe.add(dedupeKey);

    let kind: LivePlaceKind = 'customer';
    if (matches(tags, competitors)) kind = 'competitor';
    else if (matches(tags, OPPORTUNITY_SELECTORS)) kind = 'opportunity';

    places.push({
      id: `${element.type}-${element.id}`,
      name,
      kind,
      lat: Number(pointLat),
      lng: Number(pointLng),
      distanceKm: Number(distanceKm(center.lat, center.lng, Number(pointLat), Number(pointLng)).toFixed(2)),
      category: readableCategory(tags),
      tags,
    });
  }

  places.sort((a, b) => a.distanceKm - b.distanceKm);
  const limited = places.slice(0, 80);
  const competitorPlaces = limited.filter((place) => place.kind === 'competitor');
  const customerHubs = limited.filter((place) => place.kind === 'customer');
  const opportunityHubs = limited.filter((place) => place.kind === 'opportunity');

  return {
    center,
    radiusKm: Math.min(10, Math.max(2, input.radiusKm || 5)),
    updatedAt: new Date().toISOString(),
    places: limited,
    stats: {
      totalPlaces: limited.length,
      competitors: competitorPlaces.length,
      customerHubs: customerHubs.length,
      opportunityHubs: opportunityHubs.length,
      nearestCompetitorKm: competitorPlaces[0]?.distanceKm ?? null,
      competitorDensity: !competitorPlaces.length ? 'Unknown' : competitorPlaces.length >= 12 ? 'High' : competitorPlaces.length >= 5 ? 'Moderate' : 'Low',
    },
    coverageStatus: degraded ? 'unavailable' : limited.length ? 'complete' : 'empty',
    coverageNote: degraded
      ? 'Base OpenStreetMap is available. The nearby-place feed did not respond; retry for markers or open the nearby business search.'
      : !limited.length
        ? 'No mapped places were returned in this radius. This does not mean there are no real businesses or customers; try another radius or verify locally.'
      : 'Live OpenStreetMap/Overpass data can be incomplete in rural areas. Use it as decision support and verify important places locally.',
  };
}

export async function analyzeLiveMarket(input: LiveMarketRequest): Promise<LiveMarketAnalysis> {
  const params = new URLSearchParams({
    district: input.district,
    state: input.state,
    category: input.category,
    radiusKm: String(input.radiusKm || 5),
  });

  if (input.locationLabel) params.set('label', input.locationLabel);
  if (input.coordinateSource) params.set('coordinateSource', input.coordinateSource);

  if (Number.isFinite(input.lat) && Number.isFinite(input.lng)) {
    params.set('lat', String(input.lat));
    params.set('lng', String(input.lng));
  }

  // A browser request uses the visitor's connection instead of Render's shared
  // outbound IP, which public Overpass instances sometimes throttle. Known
  // coordinates need no geocoding, so try this direct route first.
  const hasCoordinates = Number.isFinite(input.lat) && Number.isFinite(input.lng);
  const center = hasCoordinates ? await resolveCenter(input) : null;
  if (center) {
    try {
      const raw = await fetchBrowserOverpass(
        center.lat, center.lng,
        Math.round(Math.min(10, Math.max(2, input.radiusKm || 5)) * 1000),
        input.category
      );
      return buildAnalysis(input, center, raw.elements || [], false);
    } catch (error) {
      console.warn('Browser OSM place feed unavailable, trying server:', error);
    }
  }

  try {
    const response = await fetch(`/api/map/analyze?${params.toString()}`);
    if (response.ok) return response.json() as Promise<LiveMarketAnalysis>;
  } catch {
    // Fall through to browser-side OSM recovery when a location needs geocoding.
  }

  if (center) return buildAnalysis(input, center, [], true);

  const resolvedCenter = await resolveCenter(input);
  try {
    const raw = await fetchBrowserOverpass(
      resolvedCenter.lat,
      resolvedCenter.lng,
      Math.round(Math.min(10, Math.max(2, input.radiusKm || 5)) * 1000),
      input.category
    );
    return buildAnalysis(input, resolvedCenter, raw.elements || [], false);
  } catch (error) {
    console.warn('Browser OSM place fallback unavailable:', error);
    // Do not blank the whole map just because the public POI query service is
    // overloaded. Return a valid center so OpenStreetMap base tiles still render.
    return buildAnalysis(input, resolvedCenter, [], true);
  }
}
