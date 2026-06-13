import { Skeleton, Stat, StatChart, StatGroup } from '@dev-dga/react';
import { CalendarDays, CircleCheck, Flame, Inbox } from 'lucide-react';
import { useT, type I18nKey } from '@/i18n';
import type { Kpis } from '@/store/selectors';
import { seriesTrend } from './overview-logic';
import { Sparkline } from './Sparkline';

export function KpiRow({
  kpis,
  intake,
  loading,
}: {
  kpis: Kpis;
  intake: number[];
  loading: boolean;
}) {
  const t = useT();
  const { trend, change } = seriesTrend(intake);
  const tiles: {
    key: I18nKey;
    value: number;
    icon: typeof Inbox;
    sentiment?: 'positive' | 'negative' | 'neutral';
    chart?: boolean;
  }[] = [
    { key: 'overview.kpi.open', value: kpis.open, icon: Inbox, chart: true },
    { key: 'overview.kpi.urgent', value: kpis.urgentOpen, icon: Flame, sentiment: 'negative' },
    {
      key: 'overview.kpi.today',
      value: kpis.todayAppointments,
      icon: CalendarDays,
      sentiment: 'neutral',
    },
    {
      key: 'overview.kpi.completed',
      value: kpis.completed,
      icon: CircleCheck,
      sentiment: 'positive',
    },
  ];
  return (
    <StatGroup columns={4} data-testid="kpis">
      {tiles.map(({ key, value, icon: Icon, sentiment, chart }) =>
        loading ? (
          <Skeleton key={key} shape="rectangle" height={104} aria-hidden="true" />
        ) : (
          <Stat
            key={key}
            variant="gradient"
            size="sm"
            sentiment={sentiment}
            icon={<Icon size={16} aria-hidden />}
            label={t(key)}
            value={value.toLocaleString('en-US')}
            change={chart ? change : undefined}
            changeLabel={chart ? t('overview.kpi.intakeTrend') : undefined}
            trend={chart ? trend : undefined}
          >
            {chart && (
              <StatChart>
                <Sparkline data={intake} />
              </StatChart>
            )}
          </Stat>
        ),
      )}
    </StatGroup>
  );
}
