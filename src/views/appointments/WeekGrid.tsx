import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from '@dev-dga/react';
import { weekDays, appointmentsByDay } from '@/store/schedule-selectors';
import { serviceById, DEMO_TODAY } from '@/data/fixtures';
import { APTSTATUS_BADGE, APTSTATUS_KEY } from '@/data/labels';
import { tField, useLang, useT } from '@/i18n';
import type { AppointmentsController } from './use-appointments';

export function WeekGrid({ a }: { a: AppointmentsController }) {
  const t = useT();
  const lang = useLang();
  const days = weekDays(a.weekStart);
  const byDay = appointmentsByDay(a.visible, days);

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7" data-testid="week-grid">
      {days.map((day) => (
        <Card key={day} variant={day === DEMO_TODAY ? 'filled' : 'outline'}>
          <CardHeader>
            <CardTitle asChild>
              <h2 className="text-sm">{day.slice(5)}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {byDay[day].map((apt) => (
              <Popover key={apt.id}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="justify-start">
                    {apt.time} · {tField(apt.citizen, lang)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent aria-label={t('docs.quickInfo')}>
                  <div className="flex flex-col gap-2">
                    <strong>{tField(apt.citizen, lang)}</strong>
                    <span>
                      {tField(
                        serviceById(apt.serviceId)?.name ?? {
                          en: apt.serviceId,
                          ar: apt.serviceId,
                        },
                        lang,
                      )}
                    </span>
                    <span>
                      {apt.time} · {t('apt.minutes', { n: apt.durationMin })} ·{' '}
                      {tField(apt.center, lang)}
                    </span>
                    <Badge
                      size="sm"
                      className="w-fit self-center"
                      variant={APTSTATUS_BADGE[apt.status]}
                    >
                      {t(APTSTATUS_KEY[apt.status])}
                    </Badge>
                    <Button size="sm" variant="secondary" onClick={() => a.setSelected(apt)}>
                      {t('common.view')}
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
