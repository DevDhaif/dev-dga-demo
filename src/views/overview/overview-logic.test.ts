import { describe, it, expect } from 'vitest';
import { dailyCounts, markerStatus, seriesTrend, withinRange } from './overview-logic';
import { pendingRequests } from '@/store/selectors';
import { seedState } from '@/store/state';

const JUNE: { start: Date; end: Date } = {
  start: new Date(2026, 5, 1),
  end: new Date(2026, 5, 10),
};

describe('withinRange', () => {
  it('passes everything when range is null', () => {
    expect(withinRange('2026-04-02T09:14:00+03:00', null)).toBe(true);
  });

  it('is inclusive of both day bounds', () => {
    expect(withinRange('2026-06-01T00:05:00+03:00', JUNE)).toBe(true);
    expect(withinRange('2026-06-10T23:59:00+03:00', JUNE)).toBe(true);
  });

  it('rejects dates outside the range', () => {
    expect(withinRange('2026-05-31T23:59:00+03:00', JUNE)).toBe(false);
    expect(withinRange('2026-06-11T00:00:00+03:00', JUNE)).toBe(false);
  });

  it('keeps exactly the 6 June-submitted open requests from the fixtures', () => {
    const open = pendingRequests(seedState(), 100);
    expect(open).toHaveLength(11);
    const june = open.filter((r) => withinRange(r.submittedAt, JUNE));
    expect(june.map((r) => r.id)).toEqual([
      'REQ-2026-0128',
      'REQ-2026-0127',
      'REQ-2026-0126',
      'REQ-2026-0125',
      'REQ-2026-0124',
      'REQ-2026-0123',
    ]);
  });
});

describe('dailyCounts', () => {
  it('buckets per day, oldest first, inclusive of the end day', () => {
    const dates = [
      '2026-06-08T09:00:00+03:00',
      '2026-06-09T10:00:00+03:00',
      '2026-06-09T11:00:00+03:00',
      '2026-06-10T08:00:00+03:00',
      '2026-05-01T08:00:00+03:00',
    ];
    expect(dailyCounts(dates, '2026-06-10', 3)).toEqual([1, 2, 1]);
  });
});

describe('seriesTrend', () => {
  it('compares the last half against the first half', () => {
    expect(seriesTrend([1, 1, 0, 2, 2])).toEqual({ trend: 'up', change: '+100%' });
    expect(seriesTrend([2, 2, 0, 1, 1])).toEqual({ trend: 'down', change: '-50%' });
    expect(seriesTrend([1, 1, 1, 1])).toEqual({ trend: 'flat', change: '0%' });
  });

  it('handles a zero baseline without dividing by zero', () => {
    expect(seriesTrend([0, 0, 3, 3])).toEqual({ trend: 'up', change: '+100%' });
  });
});

describe('markerStatus', () => {
  it('maps approved/completed -> success, rejected -> error, others -> default', () => {
    expect(markerStatus('approved')).toBe('success');
    expect(markerStatus('completed')).toBe('success');
    expect(markerStatus('rejected')).toBe('error');
    expect(markerStatus('submitted')).toBe('default');
    expect(markerStatus('booked')).toBe('default');
    expect(markerStatus('uploaded')).toBe('default');
    expect(markerStatus('assigned')).toBe('default');
  });
});
