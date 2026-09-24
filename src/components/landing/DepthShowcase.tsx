import { useEffect, useRef, type ReactNode, type PointerEvent } from 'react';
import { Sprout } from 'lucide-react';
import './depth-showcase.css';

/** CSS perspective keeps the landing illustration independent of WebGL and asset downloads. */
export function DepthShowcase({ children, motionEnabled }: { children: ReactNode; motionEnabled: boolean }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);

  const reset = () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    stageRef.current?.style.removeProperty('--pointer-x');
    stageRef.current?.style.removeProperty('--pointer-y');
  };

  useEffect(() => {
    if (!motionEnabled) reset();
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [motionEnabled]);

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (!motionEnabled || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2));
    const y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2));
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      stageRef.current?.style.setProperty('--pointer-x', x.toFixed(3));
      stageRef.current?.style.setProperty('--pointer-y', y.toFixed(3));
      frameRef.current = null;
    });
  };

  return (
    <div
      ref={stageRef}
      className="nirnay-depth-stage"
      data-interactive={motionEnabled ? 'true' : 'false'}
      onPointerMove={move}
      onPointerLeave={reset}
      onPointerCancel={reset}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) reset(); }}
    >
      <div className="nirnay-depth-halo" aria-hidden="true" />
      <div className="nirnay-depth-object">
        <div className="nirnay-depth-backplate nirnay-depth-backplate--far" aria-hidden="true" />
        <div className="nirnay-depth-backplate nirnay-depth-backplate--near" aria-hidden="true" />
        <div className="nirnay-depth-screen">{children}</div>
        <div className="nirnay-depth-accent nirnay-depth-accent--seed" aria-hidden="true">
          <div className="nirnay-depth-tile"><Sprout strokeWidth={1.5} /></div>
        </div>
        <div className="nirnay-depth-accent nirnay-depth-accent--coin" aria-hidden="true">
          <div className="nirnay-depth-coin"><span>₹</span></div>
        </div>
      </div>
    </div>
  );
}
