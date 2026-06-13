import type { Appointment } from '@/data/types';
import type { Bilingual } from '@/i18n';

export const CENTERS: Bilingual[] = [
  { en: 'North Center', ar: 'مركز الشمال' },
  { en: 'Downtown Center', ar: 'مركز وسط المدينة' },
  { en: 'East Center', ar: 'مركز الشرق' },
];

export function weekStartOf(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  const offset = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - offset);
  return d.toISOString().slice(0, 10);
}

export function addDays(date: string, n: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function filterByCenter(appointments: Appointment[], centerEn: string): Appointment[] {
  return centerEn === 'all' ? appointments : appointments.filter((a) => a.center.en === centerEn);
}

export function timeSlots(): string[] {
  return Array.from({ length: 16 }, (_, i) => {
    const h = 8 + Math.floor(i / 2);
    return `${String(h).padStart(2, '0')}:${i % 2 ? '30' : '00'}`;
  });
}

export interface BookingDraft {
  citizen: string;
  serviceId: string;
  centerEn: string;
  date: Date | null;
  time: string;
  durationMin: number;
}

export function blankBooking(): BookingDraft {
  return { citizen: '', serviceId: '', centerEn: '', date: null, time: '', durationMin: 30 };
}

export function bookingValid(b: BookingDraft): boolean {
  return (
    b.citizen.trim() !== '' &&
    b.serviceId !== '' &&
    b.centerEn !== '' &&
    b.date !== null &&
    b.time !== ''
  );
}

export function toAppointment(b: BookingDraft, id: string): Appointment {
  const d = b.date!;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return {
    id,
    serviceId: b.serviceId,
    citizen: { en: b.citizen, ar: b.citizen },
    center: CENTERS.find((c) => c.en === b.centerEn) ?? { en: b.centerEn, ar: b.centerEn },
    date: `${y}-${m}-${day}`,
    time: b.time,
    durationMin: b.durationMin,
    status: 'booked',
  };
}
