import type { DateRange, TimelineStatus } from '@dev-dga/react';
import type { ActivityKind } from '@/data/types';

function isoDay(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function withinRange(submittedAt: string, range: DateRange | null): boolean {
  if (!range) return true;
  const day = submittedAt.slice(0, 10);
  return day >= isoDay(range.start) && day <= isoDay(range.end);
}

export function markerStatus(kind: ActivityKind): TimelineStatus {
  if (kind === 'approved' || kind === 'completed') return 'success';
  if (kind === 'rejected') return 'error';
  return 'default';
}

export function dailyCounts(isoDates: string[], endDay: string, days: number): number[] {
  const end = new Date(`${endDay}T00:00:00`);
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(end);
    d.setDate(end.getDate() - (days - 1 - i));
    const day = isoDay(d);
    return isoDates.filter((at) => at.slice(0, 10) === day).length;
  });
}

export interface SeriesTrend {
  trend: 'up' | 'down' | 'flat';
  change: string;
}

export function seriesTrend(series: number[]): SeriesTrend {
  const half = Math.floor(series.length / 2);
  const prev = series.slice(0, half).reduce((a, b) => a + b, 0);
  const cur = series.slice(series.length - half).reduce((a, b) => a + b, 0);
  if (prev === cur) return { trend: 'flat', change: '0%' };
  const pct = prev === 0 ? 100 : Math.round(((cur - prev) / prev) * 100);
  return cur > prev
    ? { trend: 'up', change: `+${pct.toLocaleString('en-US')}%` }
    : { trend: 'down', change: `${pct.toLocaleString('en-US')}%` };
}
