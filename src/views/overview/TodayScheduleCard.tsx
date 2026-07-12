import {
  Card,
  CardContent,
  CardHeader,
  CardIcon,
  CardTitle,
  EmptyState,
  Tag,
} from '@dev-dga/react';
import { CalendarDays } from 'lucide-react';
import { RowList, RowItem } from '@/components/RowList';
import { tField, useLang, useT } from '@/i18n';
import { APTSTATUS_BADGE, APTSTATUS_KEY } from '@/data/labels';
import { DEMO_TODAY } from '@/data/fixtures';
import { appointmentsOn } from '@/store/schedule-selectors';
import { useStore } from '@/store/store-context';

export function TodayScheduleCard({ className }: { className?: string }) {
  const t = useT();
  const lang = useLang();
  const { state } = useStore();
  const todays = appointmentsOn(state.appointments, DEMO_TODAY);
  return (
    <Card className={className} data-testid="today-schedule">
      <CardHeader>
        <CardIcon>
          <CalendarDays />
        </CardIcon>
        <CardTitle asChild>
          <h2>{t('overview.today')}</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {todays.length === 0 ? (
          <EmptyState size="md" title={t('overview.noAppointments')} />
        ) : (
          <RowList divided>
            {todays.map((a) => (
              <RowItem
                key={a.id}
                primary={`${a.time} · ${tField(a.citizen, lang)}`}
                secondary={tField(a.center, lang)}
                trailing={
                  <Tag variant={APTSTATUS_BADGE[a.status]}>{t(APTSTATUS_KEY[a.status])}</Tag>
                }
              />
            ))}
          </RowList>
        )}
      </CardContent>
    </Card>
  );
}
