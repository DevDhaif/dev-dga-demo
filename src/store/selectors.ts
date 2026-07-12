import type { RequestStatus, Service, ServiceRequest } from '@/data/types';
import type { Lang } from '@/i18n';
import { paginate, type Paged } from './paging';
import type { AppState } from './state';

const PRIORITY_ORDER = { low: 0, normal: 1, high: 2, urgent: 3 } as const;
const STATUS_ORDER = { new: 0, in_review: 1, approved: 2, rejected: 3, completed: 4 } as const;
const OPEN: RequestStatus[] = ['new', 'in_review'];

export interface Kpis {
  open: number;
  urgentOpen: number;
  todayAppointments: number;
  completed: number;
}

export function kpis(state: AppState, today: string): Kpis {
  const open = state.requests.filter((r) => OPEN.includes(r.status));
  return {
    open: open.length,
    urgentOpen: open.filter((r) => r.priority === 'urgent').length,
    todayAppointments: state.appointments.filter(
      (a) => a.date === today && (a.status === 'booked' || a.status === 'completed'),
    ).length,
    completed: state.requests.filter((r) => r.status === 'completed').length,
  };
}

export function pendingRequests(state: AppState, n: number): ServiceRequest[] {
  return state.requests
    .filter((r) => OPEN.includes(r.status))
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
    .slice(0, n);
}

export function recentActivity(state: AppState, n: number) {
  return state.activity.slice(0, n);
}

export function unreadActivity(state: AppState) {
  return state.activity.filter((a) => !state.readActivity.includes(a.id));
}

export function openRequestsCount(state: AppState): number {
  return state.requests.filter((r) => OPEN.includes(r.status)).length;
}

export interface RequestFilter {
  query: string;
  lang: Lang;
  status: RequestStatus | 'all';
  serviceId: string | 'all';
  sortBy: 'submittedAt' | 'priority' | 'status';
  sortDir: 'asc' | 'desc';
  page: number; // 1-based
  pageSize: number;
}

export function filterRequests(
  requests: ServiceRequest[],
  services: Service[],
  f: RequestFilter,
): Paged<ServiceRequest> {
  const q = f.query.trim().toLowerCase();
  const serviceName = (id: string) =>
    services.find((s) => s.id === id)?.name[f.lang].toLowerCase() ?? '';
  const rows = requests
    .filter(
      (r) =>
        (f.status === 'all' || r.status === f.status) &&
        (f.serviceId === 'all' || r.serviceId === f.serviceId) &&
        (q === '' ||
          r.id.toLowerCase().includes(q) ||
          r.applicant.name[f.lang].toLowerCase().includes(q) ||
          serviceName(r.serviceId).includes(q)),
    )
    .sort((a, b) => {
      const cmp =
        f.sortBy === 'submittedAt'
          ? a.submittedAt.localeCompare(b.submittedAt)
          : f.sortBy === 'priority'
            ? PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
            : STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      return f.sortDir === 'asc' ? cmp : -cmp;
    });
  return paginate(rows, f.page, f.pageSize);
}

export interface StaffWorkload {
  open: number;
  approved: number;
  completed: number;
  rejected: number;
  total: number;
}

export function staffWorkload(requests: ServiceRequest[], staffId: string): StaffWorkload {
  const mine = requests.filter((r) => r.assigneeId === staffId);
  const count = (s: RequestStatus[]) => mine.filter((r) => s.includes(r.status)).length;
  return {
    open: count(['new', 'in_review']),
    approved: count(['approved']),
    completed: count(['completed']),
    rejected: count(['rejected']),
    total: mine.length,
  };
}

export function serviceVolumes(requests: ServiceRequest[]): { serviceId: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const r of requests) counts.set(r.serviceId, (counts.get(r.serviceId) ?? 0) + 1);
  return [...counts.entries()]
    .map(([serviceId, count]) => ({ serviceId, count }))
    .sort((a, b) => b.count - a.count || a.serviceId.localeCompare(b.serviceId));
}

export function requestById(state: AppState, id: string): ServiceRequest | undefined {
  return state.requests.find((r) => r.id === id);
}
