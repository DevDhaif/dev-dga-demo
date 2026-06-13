export interface Bar {
  key: string;
  label: string;
  value: number;
  color?: string;
}

const TRACK_H = 130;

export function BarChart({ bars, label }: { bars: Bar[]; label: string }) {
  const max = Math.max(...bars.map((b) => b.value), 1);
  return (
    <figure className="m-0 flex flex-col gap-3" role="img" aria-label={label}>
      <div className="flex justify-center gap-6 sm:gap-10">
        {bars.map((b) => {
          const color = b.color ?? 'var(--ddga-color-primary)';
          return (
            <div key={b.key} className="flex w-16 flex-col items-center gap-2">
              <span className="text-sm font-semibold">{b.value.toLocaleString('en-US')}</span>
              <div
                className="relative w-9 overflow-hidden rounded-full"
                style={{
                  height: TRACK_H,
                  background: `color-mix(in oklab, ${color} 10%, var(--ddga-color-muted))`,
                }}
              >
                <div
                  className="absolute inset-x-0 bottom-0 rounded-full"
                  style={{
                    height: Math.max(10, Math.round((b.value / max) * TRACK_H)),
                    background: color,
                  }}
                />
              </div>
              <span className="text-center text-sm text-(--ddga-color-muted-foreground)">
                {b.label}
              </span>
            </div>
          );
        })}
      </div>
      <figcaption className="text-center text-sm text-(--ddga-color-muted-foreground)">
        {label}
      </figcaption>
    </figure>
  );
}
