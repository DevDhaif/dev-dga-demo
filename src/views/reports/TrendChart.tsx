import { useId } from 'react';
import { smoothPath } from '../overview/sparkline-path';

export function TrendChart({ data, label }: { data: number[]; label: string }) {
  const gradientId = useId();
  const W = 600;
  const H = 170;
  const PAD = 10;
  const max = Math.max(...data, 1);
  const step = (W - PAD * 2) / Math.max(data.length - 1, 1);
  const pts = data.map((v, i) => ({
    x: +(PAD + i * step).toFixed(1),
    y: +(H - PAD - (v / max) * (H - PAD * 2 - 14)).toFixed(1),
  }));
  const line = smoothPath(pts);
  const area = `${line} L ${pts[pts.length - 1].x} ${H - PAD} L ${pts[0].x} ${H - PAD} Z`;
  const last = pts[pts.length - 1];

  return (
    <figure className="m-0 flex flex-col gap-2">
      <svg role="img" aria-label={label} viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--ddga-color-primary)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--ddga-color-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={PAD}
            x2={W - PAD}
            y1={H - PAD - f * (H - PAD * 2 - 14)}
            y2={H - PAD - f * (H - PAD * 2 - 14)}
            stroke="var(--ddga-color-border)"
            strokeDasharray="3 5"
          />
        ))}
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="var(--ddga-color-border)" />
        <path d={area} fill={`url(#${gradientId})`} />
        <path
          d={line}
          fill="none"
          stroke="var(--ddga-color-primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx={last.x} cy={last.y} r="4" fill="var(--ddga-color-primary)" />
        <circle cx={last.x} cy={last.y} r="7" fill="var(--ddga-color-primary)" opacity="0.2" />
      </svg>
      <figcaption className="text-sm text-(--ddga-color-muted-foreground)">{label}</figcaption>
    </figure>
  );
}
