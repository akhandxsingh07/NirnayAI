import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Building2,
  Crosshair,
  LoaderCircle,
  LocateFixed,
  MapPin,
  RefreshCw,
  Store,
  Users2,
} from 'lucide-react';
import type { LanguageCode } from '../types';
import {
  analyzeLiveMarket,
  type LiveMarketAnalysis,
  type LiveMarketPlace,
  type LivePlaceKind,
} from '../services/liveMapService';

interface LiveMarketMapProps {
  district: string;
  state: string;
  category: string;
  language: LanguageCode;
}

type Copy = {
  title: string;
  subtitle: string;
  live: string;
  useLocation: string;
  districtCenter: string;
  refresh: string;
  loading: string;
  failed: string;
  competitors: string;
  customers: string;
  opportunities: string;
  nearest: string;
  density: string;
  all: string;
  locationPermission: string;
  sourceNote: string;
  updated: string;
  km: string;
};

const COPY: Record<LanguageCode, Copy> = {
  en: { title: 'Live Market Map', subtitle: 'Current OpenStreetMap places around your selected market', live: 'LIVE DATA', useLocation: 'Use my location', districtCenter: 'Use district center', refresh: 'Refresh', loading: 'Scanning nearby market places...', failed: 'Live map could not load. Please retry.', competitors: 'Competitors', customers: 'Customer hubs', opportunities: 'Opportunity hubs', nearest: 'Nearest competitor', density: 'Competitor density', all: 'All', locationPermission: 'Location permission was not available, so district-center analysis is being used.', sourceNote: 'OpenStreetMap/Overpass coverage may be incomplete in rural areas. Verify important places locally.', updated: 'Updated', km: 'km' },
  hi: { title: 'लाइव मार्केट मैप', subtitle: 'आपके चुने बाजार के आसपास OpenStreetMap के वर्तमान स्थान', live: 'लाइव डेटा', useLocation: 'मेरी लोकेशन लें', districtCenter: 'जिला केंद्र लें', refresh: 'रिफ्रेश', loading: 'आसपास के बाजार स्थान खोजे जा रहे हैं...', failed: 'लाइव मैप लोड नहीं हुआ। दोबारा कोशिश करें।', competitors: 'प्रतियोगी', customers: 'ग्राहक केंद्र', opportunities: 'अवसर केंद्र', nearest: 'सबसे नजदीकी प्रतियोगी', density: 'प्रतियोगी घनत्व', all: 'सभी', locationPermission: 'लोकेशन अनुमति उपलब्ध नहीं हुई, इसलिए जिला-केंद्र विश्लेषण इस्तेमाल हो रहा है।', sourceNote: 'ग्रामीण क्षेत्रों में OpenStreetMap/Overpass कवरेज अधूरा हो सकता है। महत्वपूर्ण स्थानों की स्थानीय पुष्टि करें।', updated: 'अपडेट', km: 'किमी' },
  bn: { title: 'লাইভ মার্কেট ম্যাপ', subtitle: 'নির্বাচিত বাজারের আশেপাশের বর্তমান OpenStreetMap স্থান', live: 'লাইভ ডেটা', useLocation: 'আমার লোকেশন ব্যবহার করুন', districtCenter: 'জেলা কেন্দ্র ব্যবহার করুন', refresh: 'রিফ্রেশ', loading: 'কাছাকাছি বাজারের স্থান খোঁজা হচ্ছে...', failed: 'লাইভ ম্যাপ লোড হয়নি। আবার চেষ্টা করুন।', competitors: 'প্রতিযোগী', customers: 'গ্রাহক কেন্দ্র', opportunities: 'সুযোগ কেন্দ্র', nearest: 'নিকটতম প্রতিযোগী', density: 'প্রতিযোগীর ঘনত্ব', all: 'সব', locationPermission: 'লোকেশন অনুমতি পাওয়া যায়নি, তাই জেলা-কেন্দ্র বিশ্লেষণ ব্যবহার হচ্ছে।', sourceNote: 'গ্রামীণ এলাকায় OpenStreetMap/Overpass কভারেজ অসম্পূর্ণ হতে পারে। গুরুত্বপূর্ণ স্থান স্থানীয়ভাবে যাচাই করুন।', updated: 'আপডেট', km: 'কিমি' },
  mr: { title: 'लाइव्ह मार्केट मॅप', subtitle: 'निवडलेल्या बाजाराभोवतीचे सध्याचे OpenStreetMap ठिकाणे', live: 'लाइव्ह डेटा', useLocation: 'माझे लोकेशन वापरा', districtCenter: 'जिल्हा केंद्र वापरा', refresh: 'रिफ्रेश', loading: 'जवळची बाजार ठिकाणे शोधत आहे...', failed: 'लाइव्ह मॅप लोड झाला नाही. पुन्हा प्रयत्न करा.', competitors: 'स्पर्धक', customers: 'ग्राहक केंद्रे', opportunities: 'संधी केंद्रे', nearest: 'सर्वात जवळचा स्पर्धक', density: 'स्पर्धक घनता', all: 'सर्व', locationPermission: 'लोकेशन परवानगी मिळाली नाही, म्हणून जिल्हा-केंद्र विश्लेषण वापरले आहे.', sourceNote: 'ग्रामीण भागात OpenStreetMap/Overpass कव्हरेज अपूर्ण असू शकते. महत्त्वाची ठिकाणे स्थानिक पातळीवर तपासा.', updated: 'अपडेट', km: 'किमी' },
  ta: { title: 'நேரடி சந்தை வரைபடம்', subtitle: 'தேர்ந்தெடுத்த சந்தையைச் சுற்றியுள்ள தற்போதைய OpenStreetMap இடங்கள்', live: 'நேரடி தரவு', useLocation: 'என் இருப்பிடத்தை பயன்படுத்து', districtCenter: 'மாவட்ட மையம்', refresh: 'புதுப்பிக்க', loading: 'அருகிலுள்ள சந்தை இடங்கள் தேடப்படுகின்றன...', failed: 'நேரடி வரைபடம் ஏற்றப்படவில்லை. மீண்டும் முயற்சிக்கவும்.', competitors: 'போட்டியாளர்கள்', customers: 'வாடிக்கையாளர் மையங்கள்', opportunities: 'வாய்ப்பு மையங்கள்', nearest: 'அருகிய போட்டியாளர்', density: 'போட்டி அடர்த்தி', all: 'அனைத்தும்', locationPermission: 'இருப்பிட அனுமதி கிடைக்கவில்லை; மாவட்ட மைய பகுப்பாய்வு பயன்படுத்தப்படுகிறது.', sourceNote: 'கிராமப்புறங்களில் OpenStreetMap/Overpass தகவல் முழுமையாக இருக்காமல் இருக்கலாம். முக்கிய இடங்களை உள்ளூரில் சரிபார்க்கவும்.', updated: 'புதுப்பிப்பு', km: 'கிமீ' },
  te: { title: 'లైవ్ మార్కెట్ మ్యాప్', subtitle: 'ఎంచుకున్న మార్కెట్ చుట్టూ ఉన్న తాజా OpenStreetMap ప్రదేశాలు', live: 'లైవ్ డేటా', useLocation: 'నా లొకేషన్ వాడండి', districtCenter: 'జిల్లా కేంద్రం', refresh: 'రిఫ్రెష్', loading: 'సమీప మార్కెట్ ప్రదేశాలు స్కాన్ చేస్తున్నాం...', failed: 'లైవ్ మ్యాప్ లోడ్ కాలేదు. మళ్లీ ప్రయత్నించండి.', competitors: 'పోటీదారులు', customers: 'కస్టమర్ హబ్‌లు', opportunities: 'అవకాశ హబ్‌లు', nearest: 'సమీప పోటీదారు', density: 'పోటీ సాంద్రత', all: 'అన్నీ', locationPermission: 'లొకేషన్ అనుమతి అందలేదు; జిల్లా కేంద్ర విశ్లేషణ ఉపయోగిస్తున్నాం.', sourceNote: 'గ్రామీణ ప్రాంతాల్లో OpenStreetMap/Overpass కవరేజ్ అసంపూర్ణంగా ఉండవచ్చు. ముఖ్య ప్రదేశాలను స్థానికంగా ధృవీకరించండి.', updated: 'అప్‌డేట్', km: 'కి.మీ' },
  kn: { title: 'ಲೈವ್ ಮಾರುಕಟ್ಟೆ ನಕ್ಷೆ', subtitle: 'ಆಯ್ಕೆ ಮಾಡಿದ ಮಾರುಕಟ್ಟೆ ಸುತ್ತಿನ ಪ್ರಸ್ತುತ OpenStreetMap ಸ್ಥಳಗಳು', live: 'ಲೈವ್ ಡೇಟಾ', useLocation: 'ನನ್ನ ಸ್ಥಳ ಬಳಸಿ', districtCenter: 'ಜಿಲ್ಲಾ ಕೇಂದ್ರ ಬಳಸಿ', refresh: 'ರಿಫ್ರೆಶ್', loading: 'ಹತ್ತಿರದ ಮಾರುಕಟ್ಟೆ ಸ್ಥಳಗಳನ್ನು ಹುಡುಕುತ್ತಿದೆ...', failed: 'ಲೈವ್ ನಕ್ಷೆ ಲೋಡ್ ಆಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.', competitors: 'ಸ್ಪರ್ಧಿಗಳು', customers: 'ಗ್ರಾಹಕ ಕೇಂದ್ರಗಳು', opportunities: 'ಅವಕಾಶ ಕೇಂದ್ರಗಳು', nearest: 'ಅತೀ ಹತ್ತಿರದ ಸ್ಪರ್ಧಿ', density: 'ಸ್ಪರ್ಧಿ ಸಾಂದ್ರತೆ', all: 'ಎಲ್ಲ', locationPermission: 'ಸ್ಥಳ ಅನುಮತಿ ಲಭ್ಯವಾಗಲಿಲ್ಲ; ಜಿಲ್ಲಾ ಕೇಂದ್ರ ವಿಶ್ಲೇಷಣೆ ಬಳಸಲಾಗುತ್ತಿದೆ.', sourceNote: 'ಗ್ರಾಮೀಣ ಪ್ರದೇಶಗಳಲ್ಲಿ OpenStreetMap/Overpass ಮಾಹಿತಿ ಅಪೂರ್ಣವಾಗಬಹುದು. ಪ್ರಮುಖ ಸ್ಥಳಗಳನ್ನು ಸ್ಥಳೀಯವಾಗಿ ಪರಿಶೀಲಿಸಿ.', updated: 'ನವೀಕರಣ', km: 'ಕಿಮೀ' },
  gu: { title: 'લાઇવ માર્કેટ મેપ', subtitle: 'પસંદ કરેલા બજારની આસપાસના હાલના OpenStreetMap સ્થળો', live: 'લાઇવ ડેટા', useLocation: 'મારું લોકેશન વાપરો', districtCenter: 'જિલ્લા કેન્દ્ર વાપરો', refresh: 'રિફ્રેશ', loading: 'નજીકના બજાર સ્થળો શોધાઈ રહ્યા છે...', failed: 'લાઇવ મેપ લોડ થયો નથી. ફરી પ્રયત્ન કરો.', competitors: 'સ્પર્ધકો', customers: 'ગ્રાહક કેન્દ્રો', opportunities: 'તકોના કેન્દ્રો', nearest: 'સૌથી નજીકનો સ્પર્ધક', density: 'સ્પર્ધક ઘનતા', all: 'બધા', locationPermission: 'લોકેશન પરવાનગી મળી નથી, તેથી જિલ્લા કેન્દ્ર વિશ્લેષણ વપરાય છે.', sourceNote: 'ગ્રામ્ય વિસ્તારોમાં OpenStreetMap/Overpass કવરેજ અધૂરું હોઈ શકે છે. મહત્વના સ્થળો સ્થાનિક રીતે ચકાસો.', updated: 'અપડેટ', km: 'કિમી' },
  pa: { title: 'ਲਾਈਵ ਮਾਰਕੀਟ ਮੈਪ', subtitle: 'ਚੁਣੇ ਬਾਜ਼ਾਰ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਮੌਜੂਦਾ OpenStreetMap ਸਥਾਨ', live: 'ਲਾਈਵ ਡਾਟਾ', useLocation: 'ਮੇਰੀ ਲੋਕੇਸ਼ਨ ਵਰਤੋ', districtCenter: 'ਜ਼ਿਲ੍ਹਾ ਕੇਂਦਰ ਵਰਤੋ', refresh: 'ਰਿਫ੍ਰੈਸ਼', loading: 'ਨੇੜਲੇ ਮਾਰਕੀਟ ਸਥਾਨ ਲੱਭੇ ਜਾ ਰਹੇ ਹਨ...', failed: 'ਲਾਈਵ ਮੈਪ ਲੋਡ ਨਹੀਂ ਹੋਇਆ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।', competitors: 'ਮੁਕਾਬਲੇਬਾਜ਼', customers: 'ਗਾਹਕ ਕੇਂਦਰ', opportunities: 'ਮੌਕਾ ਕੇਂਦਰ', nearest: 'ਸਭ ਤੋਂ ਨੇੜਲਾ ਮੁਕਾਬਲੇਬਾਜ਼', density: 'ਮੁਕਾਬਲਾ ਘਣਤਾ', all: 'ਸਾਰੇ', locationPermission: 'ਲੋਕੇਸ਼ਨ ਇਜਾਜ਼ਤ ਨਹੀਂ ਮਿਲੀ, ਇਸ ਲਈ ਜ਼ਿਲ੍ਹਾ-ਕੇਂਦਰ ਵਿਸ਼ਲੇਸ਼ਣ ਵਰਤਿਆ ਜਾ ਰਿਹਾ ਹੈ।', sourceNote: 'ਪੇਂਡੂ ਖੇਤਰਾਂ ਵਿੱਚ OpenStreetMap/Overpass ਕਵਰੇਜ ਅਧੂਰੀ ਹੋ ਸਕਦੀ ਹੈ। ਮਹੱਤਵਪੂਰਨ ਸਥਾਨਾਂ ਦੀ ਸਥਾਨਕ ਪੁਸ਼ਟੀ ਕਰੋ।', updated: 'ਅਪਡੇਟ', km: 'ਕਿਮੀ' },
};

const TILE_SIZE = 256;
const VIEW_W = 768;
const VIEW_H = 480;

function project(lat: number, lng: number, zoom: number) {
  const scale = TILE_SIZE * 2 ** zoom;
  const safeLat = Math.max(-85.0511, Math.min(85.0511, lat));
  const sin = Math.sin((safeLat * Math.PI) / 180);
  return {
    x: ((lng + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale,
  };
}

function buildTiles(centerLat: number, centerLng: number, zoom: number) {
  const center = project(centerLat, centerLng, zoom);
  const left = center.x - VIEW_W / 2;
  const top = center.y - VIEW_H / 2;
  const minX = Math.floor(left / TILE_SIZE);
  const maxX = Math.floor((left + VIEW_W) / TILE_SIZE);
  const minY = Math.floor(top / TILE_SIZE);
  const maxY = Math.floor((top + VIEW_H) / TILE_SIZE);
  const worldTiles = 2 ** zoom;
  const tiles: Array<{ x: number; y: number; href: string; drawX: number; drawY: number }> = [];

  for (let y = minY; y <= maxY; y += 1) {
    if (y < 0 || y >= worldTiles) continue;
    for (let x = minX; x <= maxX; x += 1) {
      const wrappedX = ((x % worldTiles) + worldTiles) % worldTiles;
      tiles.push({
        x,
        y,
        href: `https://tile.openstreetmap.org/${zoom}/${wrappedX}/${y}.png`,
        drawX: x * TILE_SIZE - left,
        drawY: y * TILE_SIZE - top,
      });
    }
  }

  return { tiles, left, top };
}

function markerColor(kind: LivePlaceKind) {
  if (kind === 'competitor') return '#B85C4A';
  if (kind === 'opportunity') return '#7A6B2F';
  return '#365E78';
}

export const LiveMarketMap: React.FC<LiveMarketMapProps> = ({ district, state, category, language }) => {
  const copy = COPY[language] || COPY.en;
  const [data, setData] = useState<LiveMarketAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [radiusKm, setRadiusKm] = useState(5);
  const [filter, setFilter] = useState<'all' | LivePlaceKind>('all');
  const [selected, setSelected] = useState<LiveMarketPlace | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationNotice, setLocationNotice] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    analyzeLiveMarket({ district, state, category, radiusKm, ...(coords || {}) })
      .then((result) => {
        if (!active) return;
        setData(result);
        setSelected(result.places[0] || null);
      })
      .catch((err: Error) => {
        if (!active) return;
        setError(err.message || copy.failed);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [district, state, category, radiusKm, coords, refreshKey, copy.failed]);

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationNotice(copy.locationPermission);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationNotice('');
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
      },
      () => setLocationNotice(copy.locationPermission),
      { enableHighAccuracy: true, timeout: 9000, maximumAge: 120000 }
    );
  };

  const visiblePlaces = useMemo(
    () => data?.places.filter((place) => filter === 'all' || place.kind === filter) || [],
    [data, filter]
  );

  const zoom = radiusKm <= 5 ? 13 : 12;
  const mapGeometry = data ? buildTiles(data.center.lat, data.center.lng, zoom) : null;
  const centerWorld = data ? project(data.center.lat, data.center.lng, zoom) : null;

  return (
    <div className="overflow-hidden rounded-3xl border border-[#D9B99B]/50 bg-white shadow-[0_18px_55px_rgba(75,48,35,.08)]">
      <div className="flex flex-col gap-3 border-b border-[#E8D9C8] bg-[#FFFDF8] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-[#7A4D32]" />
            <h3 className="text-base font-black text-[#2B1B16]">{copy.title}</h3>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-800">{copy.live}</span>
          </div>
          <p className="mt-1 text-[11px] text-[#846653]">{copy.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[5, 10].map((value) => (
            <button key={value} onClick={() => setRadiusKm(value)} className={`rounded-xl px-3 py-2 text-[11px] font-extrabold ${radiusKm === value ? 'bg-[#4A2F24] text-white' : 'border border-[#D9B99B]/60 bg-white text-[#6B4535]'}`}>
              {value} {copy.km}
            </button>
          ))}
          <button onClick={useMyLocation} className="inline-flex items-center gap-1.5 rounded-xl border border-[#B8C09B] bg-[#F5F7EE] px-3 py-2 text-[11px] font-extrabold text-[#46502F]">
            <LocateFixed className="h-3.5 w-3.5" /> {copy.useLocation}
          </button>
          {coords && (
            <button onClick={() => setCoords(null)} className="inline-flex items-center gap-1.5 rounded-xl border border-[#D9B99B]/60 bg-white px-3 py-2 text-[11px] font-extrabold text-[#6B4535]">
              <Crosshair className="h-3.5 w-3.5" /> {copy.districtCenter}
            </button>
          )}
          <button onClick={() => setRefreshKey((value) => value + 1)} className="rounded-xl border border-[#D9B99B]/60 bg-white p-2 text-[#6B4535]" title={copy.refresh}>
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {locationNotice && <div className="border-b border-amber-200 bg-amber-50 px-5 py-2 text-[11px] text-amber-900">{locationNotice}</div>}

      {loading && (
        <div className="flex min-h-[420px] items-center justify-center gap-2 text-sm font-bold text-[#7A5A49]">
          <LoaderCircle className="h-5 w-5 animate-spin" /> {copy.loading}
        </div>
      )}

      {!loading && error && (
        <div className="flex min-h-[360px] flex-col items-center justify-center gap-3 px-6 text-center">
          <AlertTriangle className="h-8 w-8 text-amber-700" />
          <p className="max-w-lg text-sm font-bold text-[#6B4535]">{error || copy.failed}</p>
          <button onClick={() => setRefreshKey((value) => value + 1)} className="rounded-xl bg-[#4A2F24] px-4 py-2 text-xs font-extrabold text-white">{copy.refresh}</button>
        </div>
      )}

      {!loading && !error && data && mapGeometry && centerWorld && (
        <>
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="relative overflow-hidden border-b border-[#E8D9C8] bg-[#EEE8DE] lg:border-b-0 lg:border-r">
              <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="block h-auto w-full" role="img" aria-label={copy.title}>
                {mapGeometry.tiles.map((tile) => (
                  <image key={`${tile.x}-${tile.y}`} href={tile.href} x={tile.drawX} y={tile.drawY} width={TILE_SIZE} height={TILE_SIZE} />
                ))}

                <circle cx={VIEW_W / 2} cy={VIEW_H / 2} r="12" fill="#2B1B16" stroke="#FFFDF8" strokeWidth="4" />
                <circle cx={VIEW_W / 2} cy={VIEW_H / 2} r="24" fill="none" stroke="#2B1B16" strokeOpacity="0.25" strokeWidth="3" />

                {visiblePlaces.slice(0, 45).map((place) => {
                  const p = project(place.lat, place.lng, zoom);
                  const x = p.x - mapGeometry.left;
                  const y = p.y - mapGeometry.top;
                  if (x < -20 || y < -20 || x > VIEW_W + 20 || y > VIEW_H + 20) return null;
                  const active = selected?.id === place.id;
                  return (
                    <g key={place.id} onClick={() => setSelected(place)} className="cursor-pointer">
                      {active && <circle cx={x} cy={y} r="14" fill="none" stroke="#2B1B16" strokeWidth="2" />}
                      <circle cx={x} cy={y} r={active ? 9 : 7} fill={markerColor(place.kind)} stroke="white" strokeWidth="2.5" />
                    </g>
                  );
                })}
              </svg>
              <div className="absolute bottom-2 left-2 rounded-lg bg-white/90 px-2 py-1 text-[9px] font-semibold text-[#6B4535] shadow-sm backdrop-blur">
                © OpenStreetMap contributors
              </div>
            </div>

            <div className="bg-[#FFFDF8] p-4">
              <div className="grid grid-cols-2 gap-2">
                <Stat icon={Store} label={copy.competitors} value={data.stats.competitors} />
                <Stat icon={Users2} label={copy.customers} value={data.stats.customerHubs} />
                <Stat icon={Building2} label={copy.opportunities} value={data.stats.opportunityHubs} />
                <Stat icon={Crosshair} label={copy.nearest} value={data.stats.nearestCompetitorKm == null ? '—' : `${data.stats.nearestCompetitorKm} ${copy.km}`} />
              </div>

              <div className="mt-3 rounded-2xl border border-[#D9B99B]/50 bg-white p-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#8B5E47]">{copy.density}</div>
                <div className="mt-1 text-lg font-black text-[#2B1B16]">{data.stats.competitorDensity}</div>
                <div className="mt-1 text-[10px] leading-relaxed text-[#846653]">{data.center.label}</div>
              </div>

              {selected && (
                <div className="mt-3 rounded-2xl border border-[#D9B99B]/50 bg-white p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: markerColor(selected.kind) }}>{selected.kind}</span>
                      <h4 className="mt-1 text-sm font-black text-[#2B1B16]">{selected.name}</h4>
                    </div>
                    <span className="rounded-full bg-[#F3E8DC] px-2 py-1 text-[10px] font-extrabold text-[#6B4535]">{selected.distanceKm} {copy.km}</span>
                  </div>
                  <p className="mt-2 text-[11px] capitalize text-[#7A5A49]">{selected.category}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#E8D9C8] bg-white px-5 py-4">
            <div className="flex flex-wrap gap-2">
              {([
                ['all', copy.all],
                ['competitor', copy.competitors],
                ['customer', copy.customers],
                ['opportunity', copy.opportunities],
              ] as const).map(([value, label]) => (
                <button key={value} onClick={() => setFilter(value)} className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold ${filter === value ? 'bg-[#4A2F24] text-white' : 'border border-[#D9B99B]/60 bg-[#FAF7F3] text-[#6B4535]'}`}>
                  {label}
                </button>
              ))}
            </div>
            <div className="text-[10px] leading-relaxed text-[#846653]">
              {copy.updated}: {new Date(data.updatedAt).toLocaleTimeString()} · {copy.sourceNote}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

function Stat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#D9B99B]/50 bg-white p-3">
      <Icon className="h-4 w-4 text-[#8B5E47]" />
      <div className="mt-2 text-lg font-black text-[#2B1B16]">{value}</div>
      <div className="mt-0.5 text-[9px] font-bold uppercase tracking-wide text-[#8B5E47]">{label}</div>
    </div>
  );
}
