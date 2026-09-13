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
    source: 'live-location' | 'district';
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
    competitorDensity: 'Low' | 'Moderate' | 'High';
  };
  coverageNote: string;
}

export interface LiveMarketRequest {
  district: string;
  state: string;
  category: string;
  radiusKm?: number;
  lat?: number;
  lng?: number;
}

export async function analyzeLiveMarket(input: LiveMarketRequest): Promise<LiveMarketAnalysis> {
  const params = new URLSearchParams({
    district: input.district,
    state: input.state,
    category: input.category,
    radiusKm: String(input.radiusKm || 5),
  });

  if (Number.isFinite(input.lat) && Number.isFinite(input.lng)) {
    params.set('lat', String(input.lat));
    params.set('lng', String(input.lng));
  }

  const response = await fetch(`/api/map/analyze?${params.toString()}`);
  if (!response.ok) {
    let message = 'Live map analysis is temporarily unavailable.';
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // Use the generic error message.
    }
    throw new Error(message);
  }

  return response.json() as Promise<LiveMarketAnalysis>;
}
