import { describe, it, expect } from 'vitest';
import { appointments } from '@/data/fixtures';
import {
  weekStartOf,
  addDays,
  filterByCenter,
  timeSlots,
  blankBooking,
  bookingValid,
  toAppointment,
} from './appointments-logic';
import { weekDays, appointmentsByDay } from '@/store/schedule-selectors';

describe('appointments logic', () => {
  it('weekStartOf returns the Monday of the demo week', () => {
    expect(weekStartOf('2026-06-10')).toBe('2026-06-08');
    expect(weekStartOf('2026-06-08')).toBe('2026-06-08');
    expect(weekStartOf('2026-06-14')).toBe('2026-06-08');
  });

  it('addDays steps weeks', () => {
    expect(addDays('2026-06-08', 7)).toBe('2026-06-15');
    expect(addDays('2026-06-08', -7)).toBe('2026-06-01');
  });

  it('the demo week holds the 12 in-week fixtures', () => {
    const byDay = appointmentsByDay(appointments, weekDays('2026-06-08'));
    const count = Object.values(byDay).reduce((n, list) => n + list.length, 0);
    expect(count).toBe(12);
  });

  it('filterByCenter narrows to one center, all passes through', () => {
    const north = filterByCenter(appointments, 'North Center');
    expect(north.length).toBeGreaterThan(0);
    expect(north.every((a) => a.center.en === 'North Center')).toBe(true);
    expect(filterByCenter(appointments, 'all')).toHaveLength(16);
  });

  it('timeSlots covers 08:00–15:30 in 16 half-hours', () => {
    const slots = timeSlots();
    expect(slots).toHaveLength(16);
    expect(slots[0]).toBe('08:00');
    expect(slots[15]).toBe('15:30');
  });

  it('booking validity + conversion', () => {
    expect(bookingValid(blankBooking())).toBe(false);
    const b = {
      citizen: 'Test Citizen',
      serviceId: 'svc-x',
      centerEn: 'East Center',
      date: new Date(2026, 5, 11),
      time: '09:30',
      durationMin: 30,
    };
    expect(bookingValid(b)).toBe(true);
    const apt = toAppointment(b, 'apt-live-1');
    expect(apt).toMatchObject({
      id: 'apt-live-1',
      date: '2026-06-11',
      time: '09:30',
      status: 'booked',
    });
    expect(apt.center.ar).toBe('مركز الشرق');
  });
});
