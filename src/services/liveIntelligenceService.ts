export interface LiveWeatherDay {
  date: string;
  maxTempC: number | null;
  minTempC: number | null;
  precipitationMm: number | null;
  precipitationProbability: number | null;
}

export interface LiveMandiRecord {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  minPrice: number | null;
  maxPrice: number | null;
  modalPrice: number | null;
  arrivalDate: string;
}

export interface LiveIntelligencePayload {
  center: {
    lat: number;
    lng: number;
    label: string;
    source: 'coordinates' | 'district';
  };
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
    forecast: LiveWeatherDay[];
    note: string;
  };
  mandi: {
    configured: boolean;
    available: boolean;
    coverage: 'district' | 'state' | 'none';
    records: LiveMandiRecord[];
    source: string;
    note: string;
  };
  schemes: {
    source: string;
    verificationUrl: string;
    note: string;
  };
}

export async function fetchLiveIntelligence(input: {
  district: string;
  state: string;
  category: string;
  latitude?: number;
  longitude?: number;
}): Promise<LiveIntelligencePayload> {
  const params = new URLSearchParams({
    district: input.district,
    state: input.state,
    category: input.category,
  });

  if (Number.isFinite(input.latitude)) params.set('lat', String(input.latitude));
  if (Number.isFinite(input.longitude)) params.set('lng', String(input.longitude));

  const response = await fetch(`/api/live/intelligence?${params.toString()}`);
  const payload = await response.json();
  if (!response.ok) throw new Error(payload?.error || 'Live intelligence unavailable.');
  return payload as LiveIntelligencePayload;
}
