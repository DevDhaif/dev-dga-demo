import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerClose,
  Button,
  TextInput,
  Select,
  SelectItem,
  DatePicker,
} from '@dev-dga/react';
import { services } from '@/data/fixtures';
import { tField, useLang, useT } from '@/i18n';
import { CENTERS, timeSlots } from './appointments-logic';
import type { AppointmentsController } from './use-appointments';

export function BookDrawer({ a }: { a: AppointmentsController }) {
  const t = useT();
  const lang = useLang();
  const b = a.booking;
  const set = (patch: Partial<typeof b>) => a.setBooking({ ...b, ...patch });

  return (
    <Drawer open={a.bookOpen} onOpenChange={a.setBookOpen}>
      <DrawerContent side="end">
        <DrawerHeader>
          <DrawerTitle>{t('apt.book')}</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <div className="flex flex-col gap-3">
            <TextInput
              label={t('apt.citizen')}
              value={b.citizen}
              onChange={(e) => set({ citizen: e.target.value })}
              required
            />
            <Select
              label={t('apt.service')}
              value={b.serviceId}
              onValueChange={(v) => set({ serviceId: v })}
            >
              {services.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {tField(s.name, lang)}
                </SelectItem>
              ))}
            </Select>
            <Select
              label={t('apt.center')}
              value={b.centerEn}
              onValueChange={(v) => set({ centerEn: v })}
            >
              {CENTERS.map((c) => (
                <SelectItem key={c.en} value={c.en}>
                  {tField(c, lang)}
                </SelectItem>
              ))}
            </Select>
            <DatePicker label={t('apt.jumpTo')} value={b.date} onChange={(d) => set({ date: d })} />
            <Select label={t('apt.time')} value={b.time} onValueChange={(v) => set({ time: v })}>
              {timeSlots().map((slot) => (
                <SelectItem key={slot} value={slot}>
                  {slot}
                </SelectItem>
              ))}
            </Select>
            <Select
              label={t('apt.duration')}
              value={String(b.durationMin)}
              onValueChange={(v) => set({ durationMin: Number(v) })}
            >
              {[15, 30, 45].map((m) => (
                <SelectItem key={m} value={String(m)}>
                  {t('apt.minutes', { n: m })}
                </SelectItem>
              ))}
            </Select>
            <div className="flex gap-2">
              <DrawerClose asChild>
                <Button variant="ghost">{t('common.cancel')}</Button>
              </DrawerClose>
              <Button variant="primary" onClick={a.book}>
                {t('apt.book')}
              </Button>
            </div>
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
