import { describe, it, expect } from 'vitest';
import { seedState } from './state';
import { kpis, pendingRequests, filterRequests, serviceVolumes, staffWorkload } from './selectors';
import { appointmentsOn, weekDays, appointmentsByDay } from './schedule-selectors';
import { filterDocuments } from './document-selectors';
import { services, requests, staff, appointments, documents } from '@/data/fixtures';
import type { RequestFilter } from './selectors';

const TODAY = '2026-06-10';
const baseFilter: RequestFilter = {
  query: '',
  lang: 'en',
  status: 'all',
  serviceId: 'all',
  sortBy: 'submittedAt',
  sortDir: 'desc',
  page: 1,
  pageSize: 10,
};

describe('selectors (pinned against fixture invariants)', () => {
  it('kpis: open 11, urgentOpen 3, todayAppointments 5, completed 4', () => {
    expect(kpis(seedState(), TODAY)).toEqual({
      open: 11,
      urgentOpen: 3,
      todayAppointments: 5,
      completed: 4,
    });
  });

  it('pendingRequests returns newest open first, capped', () => {
    const pending = pendingRequests(seedState(), 5);
    expect(pending).toHaveLength(5);
    expect(pending.every((r) => r.status === 'new' || r.status === 'in_review')).toBe(true);
    for (let i = 1; i < pending.length; i++) {
      expect(pending[i - 1].submittedAt >= pending[i].submittedAt).toBe(true);
    }
  });

  it('filterRequests: defaults -> 28 total, 3 pages of 10', () => {
    const { rows, total, pageCount } = filterRequests(requests, services, baseFilter);
    expect(total).toBe(28);
    expect(pageCount).toBe(3);
    expect(rows).toHaveLength(10);
  });

  it('filterRequests: status filter pins counts', () => {
    expect(filterRequests(requests, services, { ...baseFilter, status: 'new' }).total).toBe(6);
    expect(filterRequests(requests, services, { ...baseFilter, status: 'approved' }).total).toBe(8);
  });

  it('filterRequests: query matches id and applicant name per lang', () => {
    const byId = filterRequests(requests, services, { ...baseFilter, query: 'REQ-2026-0101' });
    expect(byId.total).toBe(1);
    const name = requests[0].applicant.name.ar;
    const byName = filterRequests(requests, services, { ...baseFilter, lang: 'ar', query: name });
    expect(byName.total).toBeGreaterThanOrEqual(1);
  });

  it('filterRequests: priority sort puts urgent first (desc)', () => {
    const { rows } = filterRequests(requests, services, {
      ...baseFilter,
      sortBy: 'priority',
      pageSize: 28,
    });
    expect(rows[0].priority).toBe('urgent');
    expect(rows[27].priority).toBe('low');
  });

  it('appointmentsOn: 5 active today, sorted by time', () => {
    const today = appointmentsOn(appointments, TODAY);
    expect(today).toHaveLength(5);
    for (let i = 1; i < today.length; i++) {
      expect(today[i - 1].time <= today[i].time).toBe(true);
    }
  });

  it('weekDays + appointmentsByDay cover the 12 in-week appointments', () => {
    const days = weekDays('2026-06-08');
    expect(days).toEqual([
      '2026-06-08',
      '2026-06-09',
      '2026-06-10',
      '2026-06-11',
      '2026-06-12',
      '2026-06-13',
      '2026-06-14',
    ]);
    const byDay = appointmentsByDay(appointments, days);
    const count = days.reduce((n, d) => n + byDay[d].length, 0);
    expect(count).toBe(12);
  });

  it('staffWorkload sums to that member’s assignments', () => {
    const m = staff[0];
    const w = staffWorkload(requests, m.id);
    expect(w.total).toBe(requests.filter((r) => r.assigneeId === m.id).length);
    expect(w.open + w.approved + w.completed + w.rejected).toBe(w.total);
  });

  it('serviceVolumes covers all 28 requests, sorted desc', () => {
    const v = serviceVolumes(requests);
    expect(v.reduce((n, x) => n + x.count, 0)).toBe(28);
    for (let i = 1; i < v.length; i++) expect(v[i - 1].count >= v[i].count).toBe(true);
  });

  it('filterDocuments: kind filter pins counts', () => {
    const f = { query: '', lang: 'en' as const, kind: 'all' as const, page: 1, pageSize: 12 };
    expect(filterDocuments(documents, f).total).toBe(16);
    expect(filterDocuments(documents, { ...f, kind: 'pdf' }).total).toBe(7);
    expect(filterDocuments(documents, { ...f, kind: 'image' }).total).toBe(6);
  });
});
