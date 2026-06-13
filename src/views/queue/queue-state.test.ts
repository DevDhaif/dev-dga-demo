import { describe, it, expect } from 'vitest';
import { requests, services } from '@/data/fixtures';
import { filterRequests } from '@/store/selectors';
import {
  allOnPageSelected,
  initialQueueState,
  queueReducer,
  toRequestFilter,
  type QueueState,
} from './queue-state';

const withSelection: QueueState = { ...initialQueueState, page: 2, selected: ['REQ-2026-0101'] };

describe('queueReducer', () => {
  it('setQuery resets page and clears selection', () => {
    const next = queueReducer(withSelection, { type: 'setQuery', query: 'permit' });
    expect(next).toMatchObject({ query: 'permit', page: 1, selected: [] });
  });

  it('setStatusTab resets page and clears selection', () => {
    const next = queueReducer(withSelection, { type: 'setStatusTab', status: 'new' });
    expect(next).toMatchObject({ status: 'new', page: 1, selected: [] });
  });

  it('setService resets page and clears selection', () => {
    const next = queueReducer(withSelection, { type: 'setService', serviceId: 'svc-x' });
    expect(next).toMatchObject({ serviceId: 'svc-x', page: 1, selected: [] });
  });

  it('setPageSize resets page and clears selection', () => {
    const next = queueReducer(withSelection, { type: 'setPageSize', pageSize: 20 });
    expect(next).toMatchObject({ pageSize: 20, page: 1, selected: [] });
  });

  it('setPage moves the page and clears selection', () => {
    const next = queueReducer(withSelection, { type: 'setPage', page: 3 });
    expect(next).toMatchObject({ page: 3, selected: [] });
  });

  it('toggleSort flips direction on the same column', () => {
    // initial: submittedAt desc
    const next = queueReducer(initialQueueState, { type: 'toggleSort', column: 'submittedAt' });
    expect(next).toMatchObject({ sortBy: 'submittedAt', sortDir: 'asc', page: 1, selected: [] });
    const back = queueReducer(next, { type: 'toggleSort', column: 'submittedAt' });
    expect(back.sortDir).toBe('desc');
  });

  it('toggleSort switches column starting ascending, resets page + selection', () => {
    const next = queueReducer(withSelection, { type: 'toggleSort', column: 'priority' });
    expect(next).toMatchObject({ sortBy: 'priority', sortDir: 'asc', page: 1, selected: [] });
  });

  it('toggleRow adds then removes an id', () => {
    const on = queueReducer(initialQueueState, { type: 'toggleRow', id: 'REQ-2026-0102' });
    expect(on.selected).toEqual(['REQ-2026-0102']);
    const off = queueReducer(on, { type: 'toggleRow', id: 'REQ-2026-0102' });
    expect(off.selected).toEqual([]);
  });

  it('toggleAllOnPage selects the page, then deselects when all were selected', () => {
    const ids = ['a', 'b', 'c'];
    const some = queueReducer(
      { ...initialQueueState, selected: ['b'] },
      { type: 'toggleAllOnPage', pageIds: ids },
    );
    expect(some.selected.sort()).toEqual(['a', 'b', 'c']);
    const none = queueReducer(some, { type: 'toggleAllOnPage', pageIds: ids });
    expect(none.selected).toEqual([]);
  });

  it('clearSelection empties selected only', () => {
    const next = queueReducer(withSelection, { type: 'clearSelection' });
    expect(next).toMatchObject({ page: 2, selected: [] });
  });
});

describe('allOnPageSelected', () => {
  it('is true only when every page id is selected (and the page is non-empty)', () => {
    expect(allOnPageSelected(['a', 'b'], ['a', 'b'])).toBe(true);
    expect(allOnPageSelected(['a'], ['a', 'b'])).toBe(false);
    expect(allOnPageSelected([], [])).toBe(false);
  });
});

describe('toRequestFilter + filterRequests (fixture-pinned)', () => {
  it('default state: 28 total, 3 pages, page 1 = 10 newest-first rows', () => {
    const { rows, total, pageCount } = filterRequests(
      requests,
      services,
      toRequestFilter(initialQueueState, 'en'),
    );
    expect(total).toBe(28);
    expect(pageCount).toBe(3);
    expect(rows).toHaveLength(10);
    expect(rows[0].id).toBe('REQ-2026-0128'); // newest submittedAt
  });

  it('status tab "new" narrows to the 6 new fixtures', () => {
    const state = queueReducer(initialQueueState, { type: 'setStatusTab', status: 'new' });
    const { total } = filterRequests(requests, services, toRequestFilter(state, 'en'));
    expect(total).toBe(6);
  });

  it('query by id narrows to a single row', () => {
    const state = queueReducer(initialQueueState, { type: 'setQuery', query: 'REQ-2026-0101' });
    const { rows, total } = filterRequests(requests, services, toRequestFilter(state, 'en'));
    expect(total).toBe(1);
    expect(rows[0].id).toBe('REQ-2026-0101');
  });
});
