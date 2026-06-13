import { describe, it, expect } from 'vitest';
import { requests, appointments } from '@/data/fixtures';
import { statusShare, appointmentCounts, slaCompliance } from './reports-logic';

describe('reports logic (fixture-pinned)', () => {
  it('statusShare pins the 28-request distribution', () => {
    const share = statusShare(requests);
    expect(share.map((s) => s.count)).toEqual([6, 5, 8, 5, 4]);
    expect(share.find((s) => s.status === 'new')!.pct).toBe(21.4);
    expect(share.reduce((n, s) => n + s.count, 0)).toBe(28);
  });

  it('appointmentCounts pins the 16-appointment distribution', () => {
    expect(appointmentCounts(appointments)).toEqual({
      booked: 10,
      completed: 3,
      cancelled: 2,
      no_show: 1,
    });
  });

  it('slaCompliance: 12 of 17 settled are not rejected -> 71%', () => {
    expect(slaCompliance(requests)).toBe(71);
  });
});
