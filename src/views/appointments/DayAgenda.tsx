import {
  Timeline,
  TimelineItem,
  TimelineMarker,
  TimelineContent,
  TimelineTitle,
  TimelineDescription,
  TimelineTime,
  EmptyState,
  Button,
} from '@dev-dga/react';
import { appointmentsByDay } from '@/store/schedule-selectors';
import { serviceById } from '@/data/fixtures';
import { tField, useLang, useT } from '@/i18n';
import type { Appointment } from '@/data/types';
import type { AppointmentsController } from './use-appointments';

const MARKER: Record<Appointment['status'], 'default' | 'success' | 'warning' | 'error'> = {
  booked: 'default',
  completed: 'success',
  no_show: 'warning',
  cancelled: 'error',
};

export function DayAgenda({ a }: { a: AppointmentsController }) {
  const t = useT();
  const lang = useLang();
  const list = appointmentsByDay(a.visible, [a.selectedDate])[a.selectedDate];

  if (list.length === 0) return <EmptyState title={t('apt.empty')} />;

  return (
    <section aria-label={t('apt.agenda')} data-testid="day-agenda">
      <Timeline>
        {list.map((apt) => (
          <TimelineItem key={apt.id}>
            <TimelineMarker status={MARKER[apt.status]} />
            <TimelineContent>
              <TimelineTitle>
                {tField(apt.citizen, lang)} -{' '}
                {tField(
                  serviceById(apt.serviceId)?.name ?? { en: apt.serviceId, ar: apt.serviceId },
                  lang,
                )}
              </TimelineTitle>
              <TimelineDescription>
                {tField(apt.center, lang)} · {t('apt.minutes', { n: apt.durationMin })}
              </TimelineDescription>
              <TimelineTime dateTime={`${apt.date}T${apt.time}:00`}>{apt.time}</TimelineTime>
              <Button size="sm" variant="ghost" onClick={() => a.setSelected(apt)}>
                {t('common.view')}
              </Button>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </section>
  );
}
