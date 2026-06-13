import { useState } from 'react';
import { DateRangePicker, type DateRange } from '@dev-dga/react';
import { useT } from '@/i18n';
import { useStore } from '@/store/store-context';
import { kpis } from '@/store/selectors';
import { DEMO_TODAY } from '@/data/fixtures';
import { formatDate } from '@/data/labels';
import { useFakeLoading } from '@/app/use-fake-loading';
import { dailyCounts } from './overview/overview-logic';
import { KpiRow } from './overview/KpiRow';
import { ActivityCard } from './overview/ActivityCard';
import { PendingRequestsCard } from './overview/PendingRequestsCard';
import { TodayScheduleCard } from './overview/TodayScheduleCard';

export function Overview() {
  const t = useT();
  const { state } = useStore();
  const loading = useFakeLoading();
  const [range, setRange] = useState<DateRange | null>(null);

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="m-0">{t('overview.title')}</h1>
          <p className="m-0 text-sm text-(--ddga-color-muted-foreground)">
            {t('overview.subtitle', { entity: t('app.entity'), date: formatDate(DEMO_TODAY) })}
          </p>
        </div>
        <DateRangePicker size="sm" label={t('overview.range')} value={range} onChange={setRange} />
      </div>
      <KpiRow
        kpis={kpis(state, DEMO_TODAY)}
        intake={dailyCounts(
          state.requests.map((r) => r.submittedAt),
          DEMO_TODAY,
          7,
        )}
        loading={loading}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <ActivityCard className="lg:col-span-2" />
        <TodayScheduleCard />
        <PendingRequestsCard range={range} className="lg:col-span-3" />
      </div>
    </div>
  );
}
