import React, { useState } from 'react';
import { MapMarkerItem } from '../types';
import { MapPin, Navigation, Eye, Target, AlertTriangle, Users, Store, Layers } from 'lucide-react';

interface LocalMapVisualizationProps {
  markers: MapMarkerItem[];
  userLocationName: string;
  radiusKm?: number;
}

export const LocalMapVisualization: React.FC<LocalMapVisualizationProps> = ({
  markers = [],
  userLocationName,
  radiusKm = 10,
}) => {
  const safeMarkers = markers || [];
  const [selectedMarker, setSelectedMarker] = useState<MapMarkerItem | null>(safeMarkers[0] || null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'opportunity' | 'competitor' | 'gap' | 'customer'>('all');

  const filteredMarkers = safeMarkers.filter((m) => activeFilter === 'all' || m.type === activeFilter);

  const getMarkerColor = (type: MapMarkerItem['type']) => {
    switch (type) {
      case 'opportunity':
        return { bg: 'bg-[#6F7655]', text: 'text-white', border: 'border-[#474e30]', ring: 'ring-[#6F7655]/30' };
      case 'competitor':
        return { bg: 'bg-[#B9825B]', text: 'text-white', border: 'border-[#8B5E47]', ring: 'ring-[#B9825B]/30' };
      case 'gap':
        return { bg: 'bg-amber-600', text: 'text-white', border: 'border-amber-700', ring: 'ring-amber-500/30' };
      case 'customer':
        return { bg: 'bg-[#4A2F24]', text: 'text-white', border: 'border-[#2B1B16]', ring: 'ring-[#4A2F24]/30' };
    }
  };

  const getMarkerIcon = (type: MapMarkerItem['type']) => {
    switch (type) {
      case 'opportunity':
        return Store;
      case 'competitor':
        return Target;
      case 'gap':
        return AlertTriangle;
      case 'customer':
        return Users;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#D9B99B]/40 shadow-xs overflow-hidden">
      {/* Map Control Bar */}
      <div className="px-5 py-3.5 bg-[#FAF7F3] border-b border-[#D9B99B]/40 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#8B5E47]" />
          <span className="text-sm font-bold text-[#2B1B16]">
            Hyper-Local Market Radius (5 km – 10 km)
          </span>
          <span className="text-xs px-2 py-0.5 rounded-md bg-[#F3E8DC] text-[#6B4535] font-medium">
            Simulated GIS Overlay
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2.5 py-1 rounded-full font-medium transition-all ${
              activeFilter === 'all'
                ? 'bg-[#4A2F24] text-white shadow-xs'
                : 'bg-white text-[#6B4535] border border-[#D9B99B]/60 hover:bg-[#F3E8DC]'
            }`}
          >
            All ({safeMarkers.length})
          </button>
          <button
            onClick={() => setActiveFilter('opportunity')}
            className={`px-2.5 py-1 rounded-full font-medium transition-all ${
              activeFilter === 'opportunity'
                ? 'bg-[#6F7655] text-white shadow-xs'
                : 'bg-white text-[#474e30] border border-[#6F7655]/40 hover:bg-[#6F7655]/10'
            }`}
          >
            Opportunities
          </button>
          <button
            onClick={() => setActiveFilter('competitor')}
            className={`px-2.5 py-1 rounded-full font-medium transition-all ${
              activeFilter === 'competitor'
                ? 'bg-[#B9825B] text-white shadow-xs'
                : 'bg-white text-[#8B5E47] border border-[#B9825B]/40 hover:bg-[#B9825B]/10'
            }`}
          >
            Competitors
          </button>
          <button
            onClick={() => setActiveFilter('gap')}
            className={`px-2.5 py-1 rounded-full font-medium transition-all ${
              activeFilter === 'gap'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-amber-800 border border-amber-600/40 hover:bg-amber-50'
            }`}
          >
            Service Gaps
          </button>
          <button
            onClick={() => setActiveFilter('customer')}
            className={`px-2.5 py-1 rounded-full font-medium transition-all ${
              activeFilter === 'customer'
                ? 'bg-[#4A2F24] text-white shadow-xs'
                : 'bg-white text-[#4A2F24] border border-[#4A2F24]/40 hover:bg-[#4A2F24]/10'
            }`}
          >
            Target Customers
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* SVG Map Canvas */}
        <div className="lg:col-span-8 relative aspect-4/3 sm:aspect-16/10 bg-[#FAF7F3] overflow-hidden border-b lg:border-b-0 lg:border-r border-[#D9B99B]/40 select-none">
          <svg
            className="w-full h-full"
            viewBox="0 0 1000 700"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Radial gradient for local zone */}
              <radialGradient id="radiusGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#B9825B" stopOpacity="0.12" />
                <stop offset="50%" stopColor="#D9B99B" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#FAF7F3" stopOpacity="0.02" />
              </radialGradient>

              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D9B99B" strokeWidth="0.5" strokeOpacity="0.3" />
              </pattern>
            </defs>

            {/* Background Grid & Topo */}
            <rect width="1000" height="700" fill="#FAF7F3" />
            <rect width="1000" height="700" fill="url(#grid)" />

            {/* Stylized River / Canal route */}
            <path
              d="M 50 120 Q 250 180 450 350 T 850 480 T 980 620"
              fill="none"
              stroke="#D9B99B"
              strokeWidth="12"
              strokeOpacity="0.45"
              strokeLinecap="round"
            />
            <path
              d="M 50 120 Q 250 180 450 350 T 850 480 T 980 620"
              fill="none"
              stroke="#B9825B"
              strokeWidth="2"
              strokeOpacity="0.4"
              strokeDasharray="6 4"
            />

            {/* Major State Highway & Village Roads */}
            <path
              d="M 120 680 L 380 420 L 500 350 L 720 220 L 920 100"
              fill="none"
              stroke="#4A2F24"
              strokeWidth="4"
              strokeOpacity="0.25"
            />
            <path
              d="M 280 150 L 500 350 L 680 580"
              fill="none"
              stroke="#8B5E47"
              strokeWidth="2.5"
              strokeOpacity="0.2"
              strokeDasharray="4 4"
            />
            <path
              d="M 500 350 L 850 330"
              fill="none"
              stroke="#8B5E47"
              strokeWidth="2"
              strokeOpacity="0.2"
            />

            {/* Outer 10 km Radius Ring */}
            <circle
              cx="500"
              cy="350"
              r="280"
              fill="url(#radiusGradient)"
              stroke="#8B5E47"
              strokeWidth="1.5"
              strokeDasharray="8 6"
              strokeOpacity="0.45"
            />
            <text x="505" y="85" fill="#8B5E47" fontSize="13" fontWeight="600" opacity="0.8">
              10 km Outer Catchment Boundary
            </text>

            {/* Inner 5 km Radius Ring */}
            <circle
              cx="500"
              cy="350"
              r="150"
              fill="#B9825B"
              fillOpacity="0.05"
              stroke="#B9825B"
              strokeWidth="1.5"
              strokeDasharray="5 5"
              strokeOpacity="0.6"
            />
            <text x="505" y="215" fill="#6B4535" fontSize="12" fontWeight="700" opacity="0.85">
              5 km Core Delivery Radius
            </text>

            {/* Center: Proposed User Enterprise Location */}
            <g transform="translate(500, 350)">
              {/* Pulsing beacon circles */}
              <circle r="36" fill="#6B4535" fillOpacity="0.12" className="animate-ping" style={{ animationDuration: '3s' }} />
              <circle r="22" fill="#6B4535" fillOpacity="0.25" />
              <circle r="12" fill="#2B1B16" />
              <circle r="4" fill="#F3E8DC" />
              <text y="30" textAnchor="middle" fill="#2B1B16" fontSize="13" fontWeight="800">
                YOUR PROPOSED UNIT
              </text>
            </g>

            {/* Render Map Markers */}
            {filteredMarkers.map((marker) => {
              const cx = (marker.x / 100) * 1000;
              const cy = (marker.y / 100) * 700;
              const isSelected = selectedMarker?.id === marker.id;

              return (
                <g
                  key={marker.id}
                  transform={`translate(${cx}, ${cy})`}
                  className="cursor-pointer transition-transform hover:scale-125"
                  onClick={() => setSelectedMarker(marker)}
                >
                  {/* Subtle drop line to ground */}
                  <line x1="0" y1="0" x2="0" y2="14" stroke="#4A2F24" strokeWidth="1.5" strokeOpacity="0.5" />
                  {isSelected && (
                    <circle r="20" fill="none" stroke="#2B1B16" strokeWidth="2" strokeDasharray="3 3" className="animate-spin" style={{ animationDuration: '8s' }} />
                  )}
                  <circle
                    r={isSelected ? '14' : '11'}
                    fill={
                      marker.type === 'opportunity'
                        ? '#6F7655'
                        : marker.type === 'competitor'
                        ? '#B9825B'
                        : marker.type === 'gap'
                        ? '#D97706'
                        : '#4A2F24'
                    }
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                  />
                  <text
                    y="-16"
                    textAnchor="middle"
                    fill="#2B1B16"
                    fontSize="11"
                    fontWeight="700"
                    className="pointer-events-none drop-shadow-xs"
                  >
                    {marker.title.split(' ')[0]} ({marker.distanceKm}km)
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Compass Rose */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs p-2 rounded-xl border border-[#D9B99B]/60 shadow-xs flex flex-col items-center">
            <Navigation className="w-5 h-5 text-[#8B5E47] -rotate-45" />
            <span className="text-[10px] font-extrabold text-[#4A2F24] mt-0.5">N</span>
          </div>

          {/* Interactive Hint */}
          <div className="absolute bottom-3 left-4 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-[#D9B99B]/60 text-xs text-[#6B4535] flex items-center gap-1.5 shadow-xs">
            <Eye className="w-3.5 h-3.5 text-[#8B5E47]" />
            <span>Click any pin to inspect local market intelligence</span>
          </div>
        </div>

        {/* Selected Marker Detail Card */}
        <div className="lg:col-span-4 p-5 flex flex-col justify-between bg-white">
          {selectedMarker ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      getMarkerColor(selectedMarker.type).bg
                    } ${getMarkerColor(selectedMarker.type).text}`}
                  >
                    {selectedMarker.type}
                  </span>
                  <h4 className="text-base font-bold text-[#2B1B16] mt-2">
                    {selectedMarker.title}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-lg font-extrabold text-[#6B4535]">
                    {selectedMarker.distanceKm} km
                  </span>
                  <span className="block text-[11px] text-[#8B5E47]">from center</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/40 text-xs text-[#4A2F24] leading-relaxed">
                <p className="font-medium">{selectedMarker.description}</p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-[#F3E8DC]">
                  <span className="text-[#8B5E47]">Local Impact:</span>
                  <span className="font-bold text-[#2B1B16]">{selectedMarker.impact} Priority</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#F3E8DC]">
                  <span className="text-[#8B5E47]">Catchment Sector:</span>
                  <span className="font-bold text-[#2B1B16]">
                    {selectedMarker.distanceKm <= 5 ? 'Core (Within 5 km)' : 'Extended (5–10 km)'}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#8B5E47]">Validation Status:</span>
                  <span className="font-bold text-amber-800">Requires Field Verification</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-[#8B5E47]">
              Select a marker on the map to view hyper-local intelligence.
            </div>
          )}

          {/* Map Legend */}
          <div className="pt-4 mt-4 border-t border-[#D9B99B]/40">
            <span className="text-xs font-bold text-[#2B1B16] block mb-2.5">
              Map Entity Legend
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs text-[#6B4535]">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#6F7655]" />
                <span>Opportunity</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#B9825B]" />
                <span>Competitor</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-600" />
                <span>Service Gap</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#4A2F24]" />
                <span>Target Customer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
