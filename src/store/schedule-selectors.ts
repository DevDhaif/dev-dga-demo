import type { Appointment } from '@/data/types';

export function appointmentsOn(appointments: Appointment[], date: string): Appointment[] {
  return appointments
    .filter((a) => a.date === date && (a.status === 'booked' || a.status === 'completed'))
    .sort((a, b) => a.time.localeCompare(b.time));
}

export function weekDays(weekStart: string): string[] {
  const start = new Date(`${weekStart}T00:00:00Z`);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

export function appointmentsByDay(
  appointments: Appointment[],
  days: string[],
): Record<string, Appointment[]> {
  const map: Record<string, Appointment[]> = {};
  for (const day of days) {
    map[day] = appointments
      .filter((a) => a.date === day)
      .sort((a, b) => a.time.localeCompare(b.time));
  }
  return map;
}
