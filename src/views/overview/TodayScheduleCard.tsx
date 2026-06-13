import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  List,
  ListItem,
  ListItemAction,
  ListItemContent,
} from '@dev-dga/react';
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
        <CardTitle asChild>
          <h2>{t('overview.today')}</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {todays.length === 0 ? (
          <EmptyState size="sm" title={t('overview.noAppointments')} />
        ) : (
          <List variant="plain" divided>
            {todays.map((a) => (
              <ListItem key={a.id}>
                <ListItemContent
                  primary={`${a.time} · ${tField(a.citizen, lang)}`}
                  secondary={tField(a.center, lang)}
                />
                <ListItemAction>
                  <Badge variant={APTSTATUS_BADGE[a.status]}>{t(APTSTATUS_KEY[a.status])}</Badge>
                </ListItemAction>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
