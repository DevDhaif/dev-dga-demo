import {
  Button,
  ToggleGroup,
  ToggleGroupItem,
  Select,
  SelectItem,
  DatePicker,
} from '@dev-dga/react';
import { useT, tField, useLang } from '@/i18n';
import { useAppointments } from './appointments/use-appointments';
import { CENTERS } from './appointments/appointments-logic';
import { WeekGrid } from './appointments/WeekGrid';
import { DayAgenda } from './appointments/DayAgenda';
import { AppointmentDrawer } from './appointments/AppointmentDrawer';
import { BookDrawer } from './appointments/BookDrawer';

export function Appointments() {
  const t = useT();
  const lang = useLang();
  const a = useAppointments();

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0">{t('apt.title')}</h1>
        <Button variant="primary" onClick={() => a.setBookOpen(true)}>
          {t('apt.book')}
        </Button>
      </header>

      <div className="flex flex-wrap items-end gap-3">
        <ToggleGroup
          type="single"
          value={a.view}
          onValueChange={(v) => v && a.setView(v as 'week' | 'day')}
          aria-label={t('apt.title')}
        >
          <ToggleGroupItem value="week">{t('apt.week')}</ToggleGroupItem>
          <ToggleGroupItem value="day">{t('apt.day')}</ToggleGroupItem>
        </ToggleGroup>
        <DatePicker
          label={t('apt.jumpTo')}
          value={new Date(`${a.selectedDate}T00:00:00`)}
          onChange={(d) => {
            if (!d) return;
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            a.setSelectedDate(`${y}-${m}-${day}`);
          }}
        />
        <Select label={t('apt.center')} value={a.centerEn} onValueChange={a.setCenterEn}>
          <SelectItem value="all">{t('common.all')}</SelectItem>
          {CENTERS.map((c) => (
            <SelectItem key={c.en} value={c.en}>
              {tField(c, lang)}
            </SelectItem>
          ))}
        </Select>
      </div>

      {a.view === 'week' ? <WeekGrid a={a} /> : <DayAgenda a={a} />}

      <AppointmentDrawer a={a} />
      <BookDrawer a={a} />
    </div>
  );
}
