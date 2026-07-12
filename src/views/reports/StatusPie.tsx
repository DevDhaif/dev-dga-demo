import { PieChart } from '@dev-dga/react';
import type { RequestStatus } from '@/data/types';
import { STATUS_KEY } from '@/data/labels';
import { useT } from '@/i18n';

const SLICE_COLOR: Record<RequestStatus, string> = {
  new: 'var(--ddga-color-info)',
  in_review: 'var(--ddga-color-warning)',
  approved: 'var(--ddga-color-success)',
  rejected: 'var(--ddga-color-error)',
  completed: 'var(--ddga-color-muted-foreground)',
};

export function StatusPie({ shares }: { shares: { status: RequestStatus; pct: number }[] }) {
  const t = useT();
  return (
    <PieChart
      donut
      size={200}
      title={t('reports.statusShare')}
      data={shares.map((s) => ({
        label: t(STATUS_KEY[s.status]),
        value: s.pct,
        color: SLICE_COLOR[s.status],
      }))}
    />
  );
}
