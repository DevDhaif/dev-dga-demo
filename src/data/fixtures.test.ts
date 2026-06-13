import { describe, it, expect } from 'vitest';
import { services, requests, staff, appointments, documents, activity } from './fixtures';

const countBy = <T>(arr: T[], key: (x: T) => string) =>
  arr.reduce<Record<string, number>>((acc, x) => {
    acc[key(x)] = (acc[key(x)] ?? 0) + 1;
    return acc;
  }, {});

describe('fixture invariants', () => {
  it('services: 8 total, 2 per category, unique slugs', () => {
    expect(services).toHaveLength(8);
    expect(countBy(services, (s) => s.category)).toEqual({
      permits: 2,
      licenses: 2,
      certificates: 2,
      inspections: 2,
    });
    expect(new Set(services.map((s) => s.slug)).size).toBe(8);
    for (const s of services) {
      expect(s.steps).toHaveLength(4);
      expect(s.faq).toHaveLength(3);
    }
  });

  it('requests: 28 total with pinned status/priority/assignment counts', () => {
    expect(requests).toHaveLength(28);
    expect(countBy(requests, (r) => r.status)).toEqual({
      new: 6,
      in_review: 5,
      approved: 8,
      rejected: 5,
      completed: 4,
    });
    expect(requests.filter((r) => r.priority === 'urgent')).toHaveLength(4);
    for (const r of requests) {
      expect(r.urgent).toBe(r.priority === 'urgent');
      if (r.status === 'new') expect(r.assigneeId).toBeNull();
      else expect(r.assigneeId).not.toBeNull();
      expect(services.some((s) => s.id === r.serviceId)).toBe(true);
    }
  });

  it('staff: 10 with pinned departments and shift count', () => {
    expect(staff).toHaveLength(10);
    expect(countBy(staff, (m) => m.department)).toEqual({
      permits: 3,
      licenses: 3,
      inspections: 2,
      support: 2,
    });
    expect(staff.filter((m) => m.onShift)).toHaveLength(6);
  });

  it('appointments: 16 with pinned day/week/status distribution', () => {
    expect(appointments).toHaveLength(16);
    const today = appointments.filter((a) => a.date === '2026-06-10');
    expect(today).toHaveLength(5);
    expect(countBy(today, (a) => a.status)).toEqual({ booked: 4, completed: 1 });
    const week = appointments.filter((a) => a.date >= '2026-06-08' && a.date <= '2026-06-14');
    expect(week).toHaveLength(12);
    expect(countBy(appointments, (a) => a.status)).toEqual({
      booked: 10,
      completed: 3,
      cancelled: 2,
      no_show: 1,
    });
  });

  it('documents: 16 with pinned kinds, valid uploaders', () => {
    expect(documents).toHaveLength(16);
    expect(countBy(documents, (d) => d.kind)).toEqual({ image: 6, pdf: 7, sheet: 3 });
    for (const d of documents) expect(staff.some((m) => m.id === d.uploadedBy)).toBe(true);
  });

  it('activity: 12, sorted descending by at', () => {
    expect(activity).toHaveLength(12);
    const sorted = [...activity].sort((a, b) => b.at.localeCompare(a.at));
    expect(activity.map((a) => a.id)).toEqual(sorted.map((a) => a.id));
  });
});
