import { useId } from 'react';
import { smoothPath } from './sparkline-path';

export function Sparkline({ data }: { data: number[] }) {
  const gradientId = useId();
  const W = 100;
  const H = 32;
  const PAD = 3;
  const max = Math.max(...data, 1);
  const step = (W - PAD * 2) / Math.max(data.length - 1, 1);
  const pts = data.map((v, i) => ({
    x: +(PAD + i * step).toFixed(2),
    y: +(H - PAD - (v / max) * (H - PAD * 2)).toFixed(2),
  }));
  const line = smoothPath(pts);
  const area = `${line} L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className="block h-full w-full"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ddga-color-primary)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--ddga-color-primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} />
      <path
        d={line}
        fill="none"
        stroke="var(--ddga-color-primary)"
        strokeWidth="1.75"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
