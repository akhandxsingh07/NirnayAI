import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Building2,
  Crosshair,
  ExternalLink,
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
  knownDistrictCenter,
} from '../services/liveMapService';
import { InteractiveMarketMap } from './InteractiveMarketMap';

interface LiveMarketMapProps {
  district: string;
  state: string;
  category: string;
  language: LanguageCode;
  latitude?: number;
  longitude?: number;
  village?: string;
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

const MAP_CONTROLS = {
  en: { zoomIn: 'Zoom in', zoomOut: 'Zoom out', recenter: 'Recenter on selected area', empty: 'NO MAPPED PLACES', unavailable: 'PLACES UNAVAILABLE' },
  hi: { zoomIn: 'ज़ूम बढ़ाएँ', zoomOut: 'ज़ूम घटाएँ', recenter: 'चुने क्षेत्र पर लौटें', empty: 'स्थान नहीं मिले', unavailable: 'स्थान उपलब्ध नहीं' },
};

function markerColor(kind: LivePlaceKind) {
  if (kind === 'competitor') return '#B85C4A';
  if (kind === 'opportunity') return '#7A6B2F';
  return '#365E78';
}

export const LiveMarketMap: React.FC<LiveMarketMapProps> = ({ district, state, category, language, latitude, longitude, village }) => {
  const copy = COPY[language] || COPY.en;
  const controls = language === 'hi' ? MAP_CONTROLS.hi : MAP_CONTROLS.en;
  const [data, setData] = useState<LiveMarketAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [radiusKm, setRadiusKm] = useState(5);
  const [filter, setFilter] = useState<'all' | LivePlaceKind>('all');
  const [selected, setSelected] = useState<LiveMarketPlace | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationNotice, setLocationNotice] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const providedCenter = Number.isFinite(latitude) && Number.isFinite(longitude)
    ? { lat: Number(latitude), lng: Number(longitude) }
    : null;
  const previewCenter = coords || providedCenter || knownDistrictCenter(district);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    setData(null);
    setSelected(null);
    analyzeLiveMarket({
      district, state, category, radiusKm,
      ...(coords || providedCenter || {}),
      coordinateSource: coords ? 'live-location' : 'provided-location',
      locationLabel: coords ? copy.useLocation : village ? `${village}, ${district}` : district,
    })
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
  }, [district, state, category, radiusKm, coords, refreshKey, copy.failed, copy.useLocation, latitude, longitude, village]);

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

  const mapCenter = data?.center || previewCenter;
  const status = data?.coverageStatus || (data?.places.length ? 'complete' : 'empty');
  const placeFeedUnavailable = !loading && (Boolean(error) || status === 'unavailable');
  const nearbySearchUrl = mapCenter
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${category} near ${mapCenter.lat},${mapCenter.lng}`)}`
    : null;

  return (
    <div className="overflow-hidden rounded-3xl border border-[#D9B99B]/50 bg-white shadow-[0_18px_55px_rgba(75,48,35,.08)]">
      <div className="flex flex-col gap-3 border-b border-[#E8D9C8] bg-[#FFFDF8] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-[#7A4D32]" />
            <h3 className="text-base font-black text-[#2B1B16]">{copy.title}</h3>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${status === 'complete' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>{loading ? copy.loading : status === 'complete' ? copy.live : status === 'empty' ? controls.empty : controls.unavailable}</span>
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

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 border-b border-[#E8D9C8] lg:border-b-0 lg:border-r">
          {mapCenter ? (
            <InteractiveMarketMap
              center={mapCenter}
              radiusKm={radiusKm}
              places={visiblePlaces}
              selectedId={selected?.id}
              onSelect={setSelected}
              labels={{ map: copy.title, ...controls }}
            />
          ) : (
            <div className="flex h-[460px] items-center justify-center gap-2 bg-[#EEE8DE] text-sm font-bold text-[#7A5A49]"><LoaderCircle className="h-5 w-5 animate-spin" />{copy.loading}</div>
          )}
        </div>

            <div className="bg-[#FFFDF8] p-4">
              {loading && <p role="status" className="mb-3 flex items-center gap-2 text-xs text-[#6B4535]"><LoaderCircle className="h-4 w-4 animate-spin" /> {copy.loading}</p>}
              {!loading && (error || status !== 'complete') && <p role="status" className="mb-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />{error || data?.coverageNote || copy.failed}</p>}
              {placeFeedUnavailable && nearbySearchUrl && (
                <a href={nearbySearchUrl} target="_blank" rel="noopener noreferrer" className="mb-3 inline-flex items-center gap-1.5 rounded-xl border border-[#B8C09B] bg-[#F5F7EE] px-3 py-2 text-xs font-bold text-[#46502F] hover:bg-[#EAF0DB]">
                  {language === 'hi' ? 'Google Maps पर आसपास के व्यवसाय खोजें' : 'Find nearby businesses on Google Maps'}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
              <div className="grid grid-cols-2 gap-2">
                <Stat icon={Store} label={copy.competitors} value={placeFeedUnavailable ? '—' : data?.stats.competitors ?? '—'} />
                <Stat icon={Users2} label={copy.customers} value={placeFeedUnavailable ? '—' : data?.stats.customerHubs ?? '—'} />
                <Stat icon={Building2} label={copy.opportunities} value={placeFeedUnavailable ? '—' : data?.stats.opportunityHubs ?? '—'} />
                <Stat icon={Crosshair} label={copy.nearest} value={data?.stats.nearestCompetitorKm == null ? '—' : `${data.stats.nearestCompetitorKm} ${copy.km}`} />
              </div>

              <div className="mt-3 rounded-2xl border border-[#D9B99B]/50 bg-white p-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#8B5E47]">{copy.density}</div>
                <div className="mt-1 text-lg font-black text-[#2B1B16]">{data?.stats.competitorDensity ?? '—'}</div>
                <div className="mt-1 text-[10px] leading-relaxed text-[#846653]">{data?.center.label || (village ? `${village}, ${district}` : district)}</div>
              </div>

              {selected && visiblePlaces.some((place) => place.id === selected.id) && (
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

      {data && (
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
            {status === 'complete' && !visiblePlaces.length && filter !== 'all' && (
              <p role="status" className="text-xs text-[#7A5A49]">
                {language === 'hi'
                  ? `इस ${radiusKm} किमी दायरे में OpenStreetMap पर ${filter === 'competitor' ? 'प्रतियोगी' : filter === 'customer' ? 'ग्राहक केंद्र' : 'अवसर केंद्र'} नहीं मिले। स्थानीय स्तर पर भी जाँच करें।`
                  : `No mapped ${filter === 'competitor' ? 'competitors' : filter === 'customer' ? 'customer hubs' : 'opportunity hubs'} found within ${radiusKm} km. Verify nearby places locally as well.`}
              </p>
            )}
            <div className="text-[10px] leading-relaxed text-[#846653]">
              {copy.updated}: {new Date(data.updatedAt).toLocaleTimeString()} · {data.coverageNote}
            </div>
          </div>
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
