import { AssessmentFormData, LocalOpportunityData, MapMarkerItem } from '../types';

export type DemoCityId =
  | 'lucknow'
  | 'kanpur'
  | 'prayagraj'
  | 'varanasi'
  | 'ayodhya'
  | 'barabanki'
  | 'sitapur'
  | 'unnao'
  | 'raebareli'
  | 'hardoi'
  | 'sultanpur'
  | 'lakhimpur'
  | 'bahraich'
  | 'gorakhpur'
  | 'agra';

export interface DemoCity {
  id: DemoCityId;
  label: string;
  district: string;
  village: string;
  block: string;
  state: string;
  latitude?: number;
  longitude?: number;
  targetMarket: string;
}

export const DEMO_CITIES: DemoCity[] = [
  { id: 'lucknow', label: 'Lucknow', district: 'Lucknow', village: 'Bakshi Ka Talab', block: 'Bakshi Ka Talab', state: 'Uttar Pradesh', latitude: 26.986, longitude: 80.929, targetMarket: 'Households, tea stalls, sweet shops and small restaurants across peri-urban Lucknow' },
  { id: 'kanpur', label: 'Kanpur Nagar', district: 'Kanpur Nagar', village: 'Bilhaur', block: 'Bilhaur', state: 'Uttar Pradesh', latitude: 26.843, longitude: 80.063, targetMarket: 'Households, dairy retailers, canteens and highway food outlets around Kanpur Nagar' },
  { id: 'prayagraj', label: 'Prayagraj', district: 'Prayagraj', village: 'Phulpur', block: 'Phulpur', state: 'Uttar Pradesh', latitude: 25.548, longitude: 82.089, targetMarket: 'Local households, hostels, eateries, tea stalls and institutional buyers around Prayagraj' },
  { id: 'varanasi', label: 'Varanasi', district: 'Varanasi', village: 'Pindra', block: 'Pindra', state: 'Uttar Pradesh', latitude: 25.491, longitude: 82.858, targetMarket: 'Households, sweet shops, hospitality businesses and food vendors around Varanasi' },
  { id: 'ayodhya', label: 'Ayodhya', district: 'Ayodhya', village: 'Sohawal', block: 'Sohawal', state: 'Uttar Pradesh', latitude: 26.747, longitude: 81.989, targetMarket: 'Residents, dhabas, hotels, pilgrims-serving eateries and local retailers around Ayodhya' },
  { id: 'barabanki', label: 'Barabanki', district: 'Barabanki', village: 'Dewa', block: 'Dewa', state: 'Uttar Pradesh', latitude: 27.036, longitude: 81.166, targetMarket: 'Rural households, tea stalls, mandis and small food businesses around Barabanki' },
  { id: 'sitapur', label: 'Sitapur', district: 'Sitapur', village: 'Mahmudabad', block: 'Mahmudabad', state: 'Uttar Pradesh', latitude: 27.291, longitude: 81.118, targetMarket: 'Households, tea stalls, local markets and food processors around Sitapur' },
  { id: 'unnao', label: 'Unnao', district: 'Unnao', village: 'Nawabganj', block: 'Nawabganj', state: 'Uttar Pradesh', latitude: 26.616, longitude: 80.656, targetMarket: 'Households, highway outlets, retailers and small processors around Unnao' },
  { id: 'raebareli', label: 'Rae Bareli', district: 'Rae Bareli', village: 'Lalganj', block: 'Lalganj', state: 'Uttar Pradesh', latitude: 26.165, longitude: 80.966, targetMarket: 'Households, local markets, tea stalls and institutional buyers around Rae Bareli' },
  { id: 'hardoi', label: 'Hardoi', district: 'Hardoi', village: 'Sandila', block: 'Sandila', state: 'Uttar Pradesh', latitude: 27.069, longitude: 80.514, targetMarket: 'Households, mandis, dhabas and retail buyers around Hardoi' },
  { id: 'sultanpur', label: 'Sultanpur', district: 'Sultanpur', village: 'Lambhua', block: 'Lambhua', state: 'Uttar Pradesh', latitude: 26.206, longitude: 82.197, targetMarket: 'Households, local shops, eateries and wholesale buyers around Sultanpur' },
  { id: 'lakhimpur', label: 'Lakhimpur Kheri', district: 'Lakhimpur Kheri', village: 'Gola Gokaran Nath', block: 'Gola', state: 'Uttar Pradesh', latitude: 28.078, longitude: 80.47, targetMarket: 'Rural households, agricultural markets, tea stalls and retail clusters around Lakhimpur Kheri' },
  { id: 'bahraich', label: 'Bahraich', district: 'Bahraich', village: 'Nanpara', block: 'Nanpara', state: 'Uttar Pradesh', latitude: 27.864, longitude: 81.5, targetMarket: 'Households, border-route food outlets, markets and local retailers around Bahraich' },
  { id: 'gorakhpur', label: 'Gorakhpur', district: 'Gorakhpur', village: 'Pipraich', block: 'Pipraich', state: 'Uttar Pradesh', latitude: 26.827, longitude: 83.526, targetMarket: 'Households, hostels, tea stalls, hospitals and food businesses around Gorakhpur' },
  { id: 'agra', label: 'Agra', district: 'Agra', village: 'Achhnera', block: 'Achhnera', state: 'Uttar Pradesh', latitude: 27.178, longitude: 77.756, targetMarket: 'Households, hospitality businesses, sweet shops and tourist-serving food outlets around Agra' },
];

export const DEFAULT_DEMO_CITY: DemoCityId = 'lucknow';

export function getDemoCity(id: DemoCityId): DemoCity {
  return DEMO_CITIES.find((city) => city.id === id) || DEMO_CITIES[0];
}

export function buildDemoAssessment(
  cityId: DemoCityId,
  preferredLanguage: AssessmentFormData['preferredLanguage'] = 'en'
): AssessmentFormData {
  const city = getDemoCity(cityId);
  return {
    location: {
      village: city.village,
      block: city.block,
      district: city.district,
      state: city.state,
      latitude: city.latitude,
      longitude: city.longitude,
    },
    marginCapital: 50000,
    availableMargin: 50000,
    category: 'Dairy',
    ideaText: `Dairy and milk collection centre serving ${city.district} with fresh milk, curd and paneer.`,
    businessIdea: 'Dairy & Milk Collection Center (Curd/Paneer/Fresh Milk)',
    targetMarket: city.targetMarket,
    priorExperience: 'Some',
    riskWillingness: 'Medium',
    preferredLanguage,
  };
}

export function buildDemoOpportunity(cityId: DemoCityId): LocalOpportunityData {
  const city = getDemoCity(cityId);
  const markers: MapMarkerItem[] = [
    { id: 'opp-1', type: 'opportunity', title: `${city.district} Local Market Cluster`, distanceKm: 3.5, x: 68, y: 35, description: 'Recurring demand from households and local food businesses creates a dependable daily market.', impact: 'High' },
    { id: 'opp-2', type: 'opportunity', title: 'Tea Stalls & Small Restaurant Cluster', distanceKm: 2.2, x: 43, y: 58, description: 'Commercial buyers can support repeat morning supply contracts for fresh milk and curd.', impact: 'High' },
    { id: 'comp-1', type: 'competitor', title: 'Traditional Local Milk Suppliers', distanceKm: 1.6, x: 30, y: 28, description: 'Informal competition exists, but consistency, testing and packaging can differentiate the business.', impact: 'Medium' },
    { id: 'gap-1', type: 'gap', title: 'Organized Chilling & Packaging Gap', distanceKm: 4.4, x: 55, y: 78, description: 'Small-scale organized cold-chain and value-added dairy supply remains a local opportunity.', impact: 'High' },
    { id: 'cust-1', type: 'customer', title: `${city.village} Household Cluster`, distanceKm: 1.8, x: 25, y: 65, description: 'Daily household demand can support subscription-based milk delivery.', impact: 'High' },
  ];

  return {
    locationSummary: `${city.village}, ${city.block}, ${city.district} (${city.state})`,
    radiusKm: 10,
    localDemand: 'Moderate to High',
    demandSignal: `Recurring household and commercial dairy demand is modeled around ${city.district}.`,
    marketGap: 'Opportunity for tested, chilled and packaged dairy products with predictable local delivery.',
    competition: 'Moderate — mostly fragmented and informal local suppliers',
    competitorDensity: 'Indicative local supplier density; verify through field survey before investment',
    recommendedRadius: '5 km delivery radius, expandable to 10 km sourcing radius',
    suggestedProductMix: ['Fresh Milk', 'Set Curd / Dahi', 'Fresh Paneer', 'Ghee'],
    customerSegments: [city.targetMarket, 'Local tea stalls and eateries', 'Sweet shops and institutional buyers'],
    dataConfidence: 'Medium',
    sources: ['NirnayAI demo market model', 'Indicative local market assumptions', 'Field verification recommended before investment'],
    markers,
    evidenceBadge: 'INDICATIVE',
  };
}
