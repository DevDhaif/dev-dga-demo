import { describe, it, expect } from 'vitest';
import { seedState } from '@/store/state';
import { buildLog, filterByModule } from './activity-log';

describe('buildLog', () => {
  it('flattens fixtures + live activity, newest first', () => {
    const rows = buildLog(seedState());
    // 12 live activity + 28 requests + 16 appointments + 16 documents
    expect(rows.length).toBe(72);
    const dates = rows.map((r) => r.at);
    expect([...dates].sort((a, b) => b.localeCompare(a))).toEqual(dates);
  });

  it('module filter narrows; "all" is identity', () => {
    const rows = buildLog(seedState());
    expect(filterByModule(rows, 'all')).toHaveLength(rows.length);
    const docs = filterByModule(rows, 'documents');
    expect(docs.length).toBeGreaterThan(0);
    expect(docs.every((r) => r.module === 'documents')).toBe(true);
  });

  it('store mutations surface in the log', () => {
    const state = seedState();
    const before = buildLog(state).length;
    state.activity = [
      { id: 'live-1', at: '2026-06-11T08:00:00Z', kind: 'approved', text: { en: 'x', ar: 'س' } },
      ...state.activity,
    ];
    expect(buildLog(state).length).toBe(before + 1);
  });
});
