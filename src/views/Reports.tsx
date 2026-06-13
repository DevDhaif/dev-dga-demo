import { useState } from 'react';
import {
  CircularProgress,
  DateRangePicker,
  DescriptionList,
  DescriptionItem,
  DescriptionTerm,
  DescriptionDetails,
  Divider,
  Progress,
  StatGroup,
  Stat,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
  CardContent,
} from '@dev-dga/react';
import { ChartPie, CircleCheck, Flame, Gauge, Inbox } from 'lucide-react';
import { useStore } from '@/store/store-context';
import { kpis } from '@/store/selectors';
import { DEMO_TODAY } from '@/data/fixtures';
import { STATUS_KEY, APTSTATUS_KEY } from '@/data/labels';
import { useT } from '@/i18n';
import { dailyCounts } from './overview/overview-logic';
import { statusShare, appointmentCounts, slaCompliance } from './reports/reports-logic';
import { VolumesTable } from './reports/VolumesTable';
import { TrendChart } from './reports/TrendChart';
import { BarChart } from './reports/BarChart';

const APT_BAR_COLOR = {
  booked: 'var(--ddga-color-info)',
  completed: 'var(--ddga-color-success)',
  cancelled: 'var(--ddga-color-warning)',
  no_show: 'var(--ddga-color-error)',
} as const;

export function Reports() {
  const t = useT();
  const { state } = useStore();
  const [range, setRange] = useState<{ start: Date; end: Date } | null>(null);
  const k = kpis(state, DEMO_TODAY);
  const shares = statusShare(state.requests);
  const aptCounts = appointmentCounts(state.appointments);
  const sla = slaCompliance(state.requests);

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="m-0">{t('reports.title')}</h1>
        <DateRangePicker label={t('overview.range')} value={range} onChange={setRange} />
      </header>

      <StatGroup columns={4} data-testid="report-stats">
        <Stat
          variant="elevated"
          icon={<Inbox size={18} aria-hidden />}
          label={t('overview.kpi.open')}
          value={k.open.toLocaleString('en-US')}
        />
        <Stat
          variant="elevated"
          icon={<Flame size={18} aria-hidden />}
          label={t('overview.kpi.urgent')}
          value={k.urgentOpen.toLocaleString('en-US')}
        />
        <Stat
          variant="elevated"
          icon={<CircleCheck size={18} aria-hidden />}
          label={t('overview.kpi.completed')}
          value={k.completed.toLocaleString('en-US')}
        />
        <Stat
          variant="elevated"
          icon={<Gauge size={18} aria-hidden />}
          label={t('reports.sla')}
          value={`${sla}%`}
        />
      </StatGroup>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardIcon>
              <ChartPie />
            </CardIcon>
            <CardTitle asChild>
              <h2>{t('reports.statusShare')}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3" data-testid="status-share">
            {shares.map((s) => (
              <div key={s.status} className="flex items-center gap-3">
                <span className="w-28 shrink-0">{t(STATUS_KEY[s.status])}</span>
                <div className="flex-1">
                  <Progress value={s.pct} aria-label={`${t(STATUS_KEY[s.status])} ${s.pct}%`} />
                </div>
                <span className="w-16 text-end">{s.pct}%</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardIcon>
              <Gauge />
            </CardIcon>
            <CardTitle asChild>
              <h2>{t('reports.sla')}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-4">
            <CircularProgress value={sla} size="lg" showLabel aria-label={t('reports.sla')} />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="requests">
        <TabsList>
          <TabsTrigger value="requests">{t('reports.tab.requests')}</TabsTrigger>
          <TabsTrigger value="appointments">{t('reports.tab.appointments')}</TabsTrigger>
        </TabsList>
        <TabsContent value="requests" className="flex flex-col gap-4 pt-3">
          <h2 className="m-0">{t('reports.volumes')}</h2>
          <VolumesTable requests={state.requests} />
          <TrendChart
            data={dailyCounts(
              state.requests.map((r) => r.submittedAt),
              DEMO_TODAY,
              30,
            )}
            label={t('reports.intake30')}
          />
        </TabsContent>
        <TabsContent value="appointments" className="flex flex-col gap-4 pt-3">
          <h2 className="m-0">{t('reports.summary')}</h2>
          <DescriptionList divided data-testid="apt-summary">
            {(Object.keys(aptCounts) as (keyof typeof aptCounts)[]).map((s) => (
              <DescriptionItem key={s}>
                <DescriptionTerm>{t(APTSTATUS_KEY[s])}</DescriptionTerm>
                <DescriptionDetails>{aptCounts[s].toLocaleString('en-US')}</DescriptionDetails>
              </DescriptionItem>
            ))}
          </DescriptionList>
          <Divider />
          <BarChart
            label={t('reports.aptChart')}
            bars={(Object.keys(aptCounts) as (keyof typeof aptCounts)[]).map((s) => ({
              key: s,
              label: t(APTSTATUS_KEY[s]),
              value: aptCounts[s],
              color: APT_BAR_COLOR[s],
            }))}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
