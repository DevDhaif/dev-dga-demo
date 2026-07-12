import type { RequestStatus } from '@/data/types';
import type { Lang } from '@/i18n';
import type { RequestFilter } from '@/store/selectors';

export type SortColumn = 'submittedAt' | 'priority' | 'status';
export type StatusTab = RequestStatus | 'all';

export interface QueueState {
  query: string;
  status: StatusTab;
  serviceId: string;
  sortBy: SortColumn;
  sortDir: 'asc' | 'desc';
  page: number;
  pageSize: number;
  selected: string[];
}

export const initialQueueState: QueueState = {
  query: '',
  status: 'all',
  serviceId: 'all',
  sortBy: 'submittedAt',
  sortDir: 'desc',
  page: 1,
  pageSize: 10,
  selected: [],
};

const STATUS_TABS: StatusTab[] = ['all', 'new', 'in_review', 'approved', 'rejected', 'completed'];

export function statusFromParam(value: string | null): StatusTab | null {
  return value && (STATUS_TABS as string[]).includes(value) ? (value as StatusTab) : null;
}

export type QueueEvent =
  | { type: 'setQuery'; query: string }
  | { type: 'setStatusTab'; status: StatusTab }
  | { type: 'setService'; serviceId: string }
  | { type: 'setPageSize'; pageSize: number }
  | { type: 'setPage'; page: number }
  | { type: 'toggleSort'; column: SortColumn }
  | { type: 'toggleRow'; id: string }
  | { type: 'toggleAllOnPage'; pageIds: string[] }
  | { type: 'clearSelection' };

export function queueReducer(state: QueueState, event: QueueEvent): QueueState {
  switch (event.type) {
    case 'setQuery':
      return { ...state, query: event.query, page: 1, selected: [] };
    case 'setStatusTab':
      return { ...state, status: event.status, page: 1, selected: [] };
    case 'setService':
      return { ...state, serviceId: event.serviceId, page: 1, selected: [] };
    case 'setPageSize':
      return { ...state, pageSize: event.pageSize, page: 1, selected: [] };
    case 'setPage':
      return { ...state, page: event.page, selected: [] };
    case 'toggleSort': {
      const same = state.sortBy === event.column;
      return {
        ...state,
        sortBy: event.column,
        sortDir: same ? (state.sortDir === 'asc' ? 'desc' : 'asc') : 'asc',
        page: 1,
        selected: [],
      };
    }
    case 'toggleRow':
      return {
        ...state,
        selected: state.selected.includes(event.id)
          ? state.selected.filter((id) => id !== event.id)
          : [...state.selected, event.id],
      };
    case 'toggleAllOnPage':
      return {
        ...state,
        selected: allOnPageSelected(state.selected, event.pageIds)
          ? state.selected.filter((id) => !event.pageIds.includes(id))
          : [...new Set([...state.selected, ...event.pageIds])],
      };
    case 'clearSelection':
      return { ...state, selected: [] };
  }
}

export function allOnPageSelected(selected: string[], pageIds: string[]): boolean {
  return pageIds.length > 0 && pageIds.every((id) => selected.includes(id));
}

export function toRequestFilter(state: QueueState, lang: Lang): RequestFilter {
  return {
    query: state.query,
    lang,
    status: state.status,
    serviceId: state.serviceId,
    sortBy: state.sortBy,
    sortDir: state.sortDir,
    page: state.page,
    pageSize: state.pageSize,
  };
}
