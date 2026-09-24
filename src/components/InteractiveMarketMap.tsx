import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import { Crosshair, Minus, Plus } from 'lucide-react';
import type { LiveMarketPlace } from '../services/liveMapService';

const TILE_SIZE = 256;
const HEIGHT = 460;
const MIN_ZOOM = 4;
const MAX_ZOOM = 17;
const TILE_URL = 'https://tile.openstreetmap.org';

type Point = { lat: number; lng: number };

function project({ lat, lng }: Point, zoom: number) {
  const scale = TILE_SIZE * 2 ** zoom;
  const safeLat = Math.max(-85.0511, Math.min(85.0511, lat));
  const sin = Math.sin(safeLat * Math.PI / 180);
  return {
    x: (lng + 180) / 360 * scale,
    y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale,
  };
}

function unproject(x: number, y: number, zoom: number): Point {
  const scale = TILE_SIZE * 2 ** zoom;
  const lng = (((x / scale) % 1 + 1) % 1) * 360 - 180;
  const lat = Math.atan(Math.sinh(Math.PI * (1 - 2 * Math.max(0, Math.min(scale, y)) / scale))) * 180 / Math.PI;
  return { lat, lng };
}

function color(kind: LiveMarketPlace['kind']) {
  return kind === 'competitor' ? '#B85C4A' : kind === 'opportunity' ? '#7A6B2F' : '#365E78';
}

interface Props {
  center: Point;
  radiusKm: number;
  places: LiveMarketPlace[];
  selectedId?: string;
  onSelect: (place: LiveMarketPlace) => void;
  labels: { map: string; zoomIn: string; zoomOut: string; recenter: string };
}

export function InteractiveMarketMap({ center, radiusKm, places, selectedId, onSelect, labels }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; worldX: number; worldY: number } | null>(null);
  const [width, setWidth] = useState(768);
  const [view, setView] = useState<Point>(center);
  const [zoom, setZoom] = useState(radiusKm <= 5 ? 13 : 12);

  useEffect(() => {
    if (!container.current) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(1, Math.round(entry.contentRect.width))));
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    // React delegates wheel listeners passively. This listener keeps page scroll
    // from moving while someone zooms the map with a wheel or trackpad.
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      setZoom((current) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, current + (event.deltaY < 0 ? 1 : -1))));
    };
    element.addEventListener('wheel', onWheel, { passive: false });
    return () => element.removeEventListener('wheel', onWheel);
  }, []);

  useEffect(() => {
    setView(center);
    setZoom(radiusKm <= 5 ? 13 : 12);
  }, [center.lat, center.lng, radiusKm]);

  const geometry = useMemo(() => {
    const focus = project(view, zoom);
    const left = focus.x - width / 2;
    const top = focus.y - HEIGHT / 2;
    const maxTile = 2 ** zoom;
    const tiles: Array<{ key: string; src: string; x: number; y: number }> = [];
    for (let y = Math.floor(top / TILE_SIZE); y <= Math.floor((top + HEIGHT) / TILE_SIZE); y += 1) {
      if (y < 0 || y >= maxTile) continue;
      for (let x = Math.floor(left / TILE_SIZE); x <= Math.floor((left + width) / TILE_SIZE); x += 1) {
        const wrappedX = ((x % maxTile) + maxTile) % maxTile;
        tiles.push({
          key: `${zoom}-${wrappedX}-${y}`,
          src: `${TILE_URL}/${zoom}/${wrappedX}/${y}.png`,
          x: x * TILE_SIZE - left,
          y: y * TILE_SIZE - top,
        });
      }
    }
    const worldWidth = TILE_SIZE * maxTile;
    const offset = (point: Point) => {
      const p = project(point, zoom);
      // Choose the nearest wrapped copy of a marker when the map crosses 180°.
      const deltaX = ((p.x - focus.x + worldWidth / 2) % worldWidth + worldWidth) % worldWidth - worldWidth / 2;
      return { x: width / 2 + deltaX, y: p.y - top };
    };
    return { tiles, origin: offset(center), offset };
  }, [center.lat, center.lng, view, zoom, width]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || (event.target as HTMLElement).closest('button, a')) return;
    const world = project(view, zoom);
    drag.current = { x: event.clientX, y: event.clientY, worldX: world.x, worldY: world.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const { x, y, worldX, worldY } = drag.current;
    setView(unproject(worldX - (event.clientX - x), worldY - (event.clientY - y), zoom));
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const circleRadius = radiusKm * 1000 / (156543.03 * Math.cos(center.lat * Math.PI / 180) / 2 ** zoom);

  return (
    <div
      ref={container}
      className="relative h-[460px] min-w-0 touch-none overflow-hidden bg-[#EEE8DE] cursor-grab active:cursor-grabbing"
      role="region"
      aria-label={labels.map}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {geometry.tiles.map((tile) => (
        <img key={tile.key} src={tile.src} alt="" draggable={false} className="pointer-events-none absolute max-w-none select-none" style={{ left: tile.x, top: tile.y, width: TILE_SIZE, height: TILE_SIZE }} />
      ))}
      <div className="pointer-events-none absolute rounded-full border-2 border-dashed border-[#6B4535]/60 bg-[#A97838]/[0.07]" style={{ left: geometry.origin.x - circleRadius, top: geometry.origin.y - circleRadius, width: circleRadius * 2, height: circleRadius * 2 }} />
      <div className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[4px] border-white bg-[#2B1B16] shadow-[0_0_0_6px_#2B1B1640]" style={{ left: geometry.origin.x, top: geometry.origin.y }} />
      {places.map((place) => {
        const point = geometry.offset(place);
        if (point.x < -24 || point.x > width + 24 || point.y < -24 || point.y > HEIGHT + 24) return null;
        return (
          <button
            key={place.id}
            type="button"
            title={`${place.name} · ${place.distanceKm} km`}
            aria-label={`${place.name}, ${place.category}, ${place.distanceKm} km`}
            aria-pressed={selectedId === place.id}
            onClick={() => onSelect(place)}
            className="absolute z-10 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#281C13]"
            style={{ left: point.x, top: point.y, backgroundColor: color(place.kind) }}
          >
            {selectedId === place.id && <span className="h-2 w-2 rounded-full bg-white" />}
          </button>
        );
      })}
      <div className="absolute right-3 top-3 z-20 grid gap-1 rounded-xl bg-white/95 p-1 shadow-md">
        <button type="button" title={labels.zoomIn} aria-label={labels.zoomIn} onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + 1))} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-[#F3E8DC] focus-visible:outline-2"><Plus size={17} /></button>
        <button type="button" title={labels.zoomOut} aria-label={labels.zoomOut} onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z - 1))} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-[#F3E8DC] focus-visible:outline-2"><Minus size={17} /></button>
        <button type="button" title={labels.recenter} aria-label={labels.recenter} onClick={() => { setView(center); setZoom(radiusKm <= 5 ? 13 : 12); }} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-[#F3E8DC] focus-visible:outline-2"><Crosshair size={17} /></button>
      </div>
      <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="absolute bottom-2 left-2 z-20 rounded-lg bg-white/95 px-2 py-1 text-[10px] font-semibold text-[#6B4535] shadow-sm">© OpenStreetMap contributors</a>
    </div>
  );
}
