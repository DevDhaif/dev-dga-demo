import type { AppointmentStatus, RequestStatus, ServiceRequest, Appointment } from '@/data/types';

export interface StatusShare {
  status: RequestStatus;
  count: number;
  pct: number;
}

const REQUEST_STATUSES: RequestStatus[] = ['new', 'in_review', 'approved', 'rejected', 'completed'];

export function statusShare(requests: ServiceRequest[]): StatusShare[] {
  const total = requests.length || 1;
  return REQUEST_STATUSES.map((status) => {
    const count = requests.filter((r) => r.status === status).length;
    return { status, count, pct: Math.round((count / total) * 1000) / 10 };
  });
}

export function appointmentCounts(appointments: Appointment[]): Record<AppointmentStatus, number> {
  const counts: Record<AppointmentStatus, number> = {
    booked: 0,
    completed: 0,
    cancelled: 0,
    no_show: 0,
  };
  for (const a of appointments) counts[a.status] += 1;
  return counts;
}

export function slaCompliance(requests: ServiceRequest[]): number {
  const settled = requests.filter((r) => ['approved', 'rejected', 'completed'].includes(r.status));
  if (settled.length === 0) return 100;
  const ok = settled.filter((r) => r.status !== 'rejected').length;
  return Math.round((ok / settled.length) * 100);
}
