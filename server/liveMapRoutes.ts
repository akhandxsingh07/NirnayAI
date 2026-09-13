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

type CacheEntry<T> = { expiresAt: number; value: T };
const MAP_CACHE_TTL_MS = 5 * 60 * 1000;
const INTELLIGENCE_CACHE_TTL_MS = 10 * 60 * 1000;
const cache = new Map<string, CacheEntry<LiveMapPayload>>();
const intelligenceCache = new Map<string, CacheEntry<LiveIntelligencePayload>>();

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

type WeatherDay = {
  date: string;
  maxTempC: number | null;
  minTempC: number | null;
  precipitationMm: number | null;
  precipitationProbability: number | null;
};

type MandiRecord = {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  minPrice: number | null;
  maxPrice: number | null;
  modalPrice: number | null;
  arrivalDate: string;
};

type LiveIntelligencePayload = {
  center: { lat: number; lng: number; label: string; source: 'coordinates' | 'district' };
  updatedAt: string;
  feeds: {
    map: 'LIVE';
    weather: 'LIVE_FORECAST' | 'UNAVAILABLE';
    mandi: 'DAILY_OFFICIAL' | 'NOT_CONFIGURED' | 'NO_LOCAL_RECORDS' | 'UNAVAILABLE';
    schemes: 'OFFICIAL_VERIFY';
    finance: 'CALCULATED';
  };
  weather: {
    available: boolean;
    source: string;
    current?: {
      temperatureC: number | null;
      humidityPct: number | null;
      precipitationMm: number | null;
      windSpeedKmh: number | null;
      weatherCode: number | null;
      observedAt: string | null;
    };
    forecast: WeatherDay[];
    note: string;
  };
  mandi: {
    configured: boolean;
    available: boolean;
    coverage: 'district' | 'state' | 'none';
    records: MandiRecord[];
    source: string;
    note: string;
  };
  schemes: {
    source: string;
    verificationUrl: string;
    note: string;
  };
};

const OGD_MANDI_RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070';

function numberOrNull(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function weatherOperationalNote(category: string) {
  const c = category.toLowerCase();
  if (c.includes('agriculture')) return 'Use rainfall, heat and wind signals for field-work timing, irrigation and input planning. Forecasts are not guarantees.';
  if (c.includes('dairy')) return 'Heat and humidity can affect animal comfort, chilling load and spoilage risk; protect cold-chain capacity during hot periods.';
  if (c.includes('poultry')) return 'Heat and humidity can affect bird comfort, ventilation and water demand; keep backup cooling and water plans ready.';
  if (c.includes('food')) return 'Temperature and humidity can affect storage, transport and spoilage risk; verify cold-chain and packaging needs.';
  if (c.includes('electrical') || c.includes('repair')) return 'Rain and high wind can disrupt outdoor service work; use the forecast for scheduling and travel planning.';
  return 'Use the forecast for operating hours, deliveries, outdoor work and local demand planning.';
}

async function fetchWeather(lat: number, lng: number, category: string): Promise<LiveIntelligencePayload['weather']> {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(lat));
  url.searchParams.set('longitude', String(lng));
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('forecast_days', '3');
  url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m');
  url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`Weather failed with ${response.status}`);
    const data = (await response.json()) as {
      current?: Record<string, unknown>;
      daily?: Record<string, unknown>;
    };
    const current = data.current || {};
    const daily = data.daily || {};
    const times = Array.isArray(daily.time) ? daily.time : [];
    const max = Array.isArray(daily.temperature_2m_max) ? daily.temperature_2m_max : [];
    const min = Array.isArray(daily.temperature_2m_min) ? daily.temperature_2m_min : [];
    const rain = Array.isArray(daily.precipitation_sum) ? daily.precipitation_sum : [];
    const probability = Array.isArray(daily.precipitation_probability_max) ? daily.precipitation_probability_max : [];

    return {
      available: true,
      source: 'Open-Meteo forecast API',
      current: {
        temperatureC: numberOrNull(current.temperature_2m),
        humidityPct: numberOrNull(current.relative_humidity_2m),
        precipitationMm: numberOrNull(current.precipitation),
        windSpeedKmh: numberOrNull(current.wind_speed_10m),
        weatherCode: numberOrNull(current.weather_code),
        observedAt: typeof current.time === 'string' ? current.time : null,
      },
      forecast: times.slice(0, 3).map((date, i) => ({
        date: String(date),
        maxTempC: numberOrNull(max[i]),
        minTempC: numberOrNull(min[i]),
        precipitationMm: numberOrNull(rain[i]),
        precipitationProbability: numberOrNull(probability[i]),
      })),
      note: weatherOperationalNote(category),
    };
  } catch (error) {
    console.error('Live weather fetch failed:', error);
    return {
      available: false,
      source: 'Open-Meteo forecast API',
      forecast: [],
      note: 'Live weather is temporarily unavailable. Retry later and do not treat a missing forecast as a safe operating signal.',
    };
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeMandiRecord(raw: Record<string, unknown>): MandiRecord {
  return {
    state: String(raw.state || ''),
    district: String(raw.district || ''),
    market: String(raw.market || ''),
    commodity: String(raw.commodity || ''),
    variety: String(raw.variety || ''),
    minPrice: numberOrNull(raw.min_price),
    maxPrice: numberOrNull(raw.max_price),
    modalPrice: numberOrNull(raw.modal_price),
    arrivalDate: String(raw.arrival_date || ''),
  };
}

async function fetchMandiRecords(state: string, district: string): Promise<LiveIntelligencePayload['mandi']> {
  const apiKey = process.env.DATA_GOV_IN_API_KEY?.trim();
  const source = 'data.gov.in / AGMARKNET daily mandi prices';
  if (!apiKey) {
    return {
      configured: false,
      available: false,
      coverage: 'none',
      records: [],
      source,
      note: 'Official daily mandi integration is ready but DATA_GOV_IN_API_KEY is not configured on the server.',
    };
  }

  async function request(scope: 'district' | 'state') {
    const url = new URL(`https://api.data.gov.in/resource/${OGD_MANDI_RESOURCE_ID}`);
    url.searchParams.set('api-key', apiKey as string);
    url.searchParams.set('format', 'json');
    url.searchParams.set('offset', '0');
    url.searchParams.set('limit', '60');
    url.searchParams.set('filters[state]', state);
    if (scope === 'district' && district) url.searchParams.set('filters[district]', district);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error(`Mandi feed failed with ${response.status}`);
      const body = (await response.json()) as { records?: Array<Record<string, unknown>> };
      return (body.records || []).map(normalizeMandiRecord);
    } finally {
      clearTimeout(timeout);
    }
  }

  try {
    let records = await request('district');
    let coverage: 'district' | 'state' | 'none' = records.length ? 'district' : 'none';
    if (!records.length) {
      records = await request('state');
      coverage = records.length ? 'state' : 'none';
    }

    const latest = records
      .filter((record) => record.commodity && record.market)
      .slice(0, 8);

    return {
      configured: true,
      available: latest.length > 0,
      coverage,
      records: latest,
      source,
      note: coverage === 'district'
        ? `Latest available official mandi records filtered for ${district}. Prices are wholesale market observations, not guaranteed farm-gate or retail prices.`
        : coverage === 'state'
          ? `No district records were returned, so the feed shows recent ${state} records as broader context. Verify the nearest mandi before acting.`
          : 'No recent records were returned for this location. Verify prices directly with the nearest mandi.',
    };
  } catch (error) {
    console.error('Official mandi fetch failed:', error);
    return {
      configured: true,
      available: false,
      coverage: 'none',
      records: [],
      source,
      note: 'The official mandi feed is temporarily unavailable. Retry later or verify on AGMARKNET/data.gov.in.',
    };
  }
}

async function buildLiveIntelligence(
  district: string,
  state: string,
  category: string,
  requestedLat: number,
  requestedLng: number
): Promise<LiveIntelligencePayload> {
  const hasCoordinates = Number.isFinite(requestedLat) && Number.isFinite(requestedLng);
  let lat = requestedLat;
  let lng = requestedLng;
  let label = district || 'Selected area';
  let source: LiveIntelligencePayload['center']['source'] = 'coordinates';

  if (!hasCoordinates) {
    if (!district) throw new Error('District or coordinates are required.');
    const geocoded = await geocodeDistrict(district, state);
    if (!geocoded) throw new Error('Could not locate selected district.');
    lat = geocoded.lat;
    lng = geocoded.lng;
    label = geocoded.label;
    source = 'district';
  }

  const key = `intel:${lat.toFixed(3)}:${lng.toFixed(3)}:${district.toLowerCase()}:${state.toLowerCase()}:${category.toLowerCase()}:${Boolean(process.env.DATA_GOV_IN_API_KEY)}`;
  const cached = intelligenceCache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const [weather, mandi] = await Promise.all([
    fetchWeather(lat, lng, category),
    fetchMandiRecords(state, district),
  ]);

  const payload: LiveIntelligencePayload = {
    center: { lat, lng, label, source },
    updatedAt: new Date().toISOString(),
    feeds: {
      map: 'LIVE',
      weather: weather.available ? 'LIVE_FORECAST' : 'UNAVAILABLE',
      mandi: !mandi.configured
        ? 'NOT_CONFIGURED'
        : mandi.available
          ? 'DAILY_OFFICIAL'
          : mandi.coverage === 'none'
            ? 'NO_LOCAL_RECORDS'
            : 'UNAVAILABLE',
      schemes: 'OFFICIAL_VERIFY',
      finance: 'CALCULATED',
    },
    weather,
    mandi,
    schemes: {
      source: 'myScheme — Government of India',
      verificationUrl: 'https://www.myscheme.gov.in/',
      note: 'NIRNAY AI does not scrape or claim real-time scheme eligibility. Use the official myScheme portal and implementing bank/agency for current rules and eligibility.',
    },
  };

  intelligenceCache.set(key, { expiresAt: Date.now() + INTELLIGENCE_CACHE_TTL_MS, value: payload });
  if (intelligenceCache.size > 60) {
    const firstKey = intelligenceCache.keys().next().value as string | undefined;
    if (firstKey) intelligenceCache.delete(firstKey);
  }
  return payload;
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

      cache.set(cacheKey, { expiresAt: Date.now() + MAP_CACHE_TTL_MS, value: payload });
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

  app.get('/api/live/intelligence', async (req: Request, res: Response) => {
    const district = String(req.query.district || '').trim();
    const state = String(req.query.state || 'Uttar Pradesh').trim();
    const category = String(req.query.category || 'Other').trim();
    const requestedLat = Number(req.query.lat);
    const requestedLng = Number(req.query.lng);

    try {
      const payload = await buildLiveIntelligence(district, state, category, requestedLat, requestedLng);
      return res.json(payload);
    } catch (error) {
      console.error('Live intelligence failed:', error);
      return res.status(502).json({ error: 'Live intelligence is temporarily unavailable. Please retry.' });
    }
  });
}
