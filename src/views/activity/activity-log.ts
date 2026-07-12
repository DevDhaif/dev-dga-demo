import type { ActivityKind } from '@/data/types';
import type { Bilingual } from '@/i18n';
import { serviceById } from '@/data/fixtures';
import type { AppState } from '@/store/state';

export type LogModule = 'requests' | 'appointments' | 'documents';

export interface LogRow {
  id: string;
  at: string;
  kind: ActivityKind;
  module: LogModule;
  subject: Bilingual;
  ref: string;
}

export const KIND_MODULE: Record<ActivityKind, LogModule> = {
  submitted: 'requests',
  approved: 'requests',
  rejected: 'requests',
  assigned: 'requests',
  completed: 'requests',
  booked: 'appointments',
  uploaded: 'documents',
  commented: 'requests',
};

const FALLBACK: Bilingual = { en: '-', ar: '-' };

export function buildLog(state: AppState): LogRow[] {
  const live: LogRow[] = state.activity.map((e) => ({
    id: e.id,
    at: e.at,
    kind: e.kind,
    module: KIND_MODULE[e.kind],
    subject: e.text,
    ref: e.id,
  }));
  const requests: LogRow[] = state.requests.map((r) => ({
    id: `log-${r.id}`,
    at: r.submittedAt,
    kind: 'submitted',
    module: 'requests',
    subject: serviceById(r.serviceId)?.name ?? FALLBACK,
    ref: r.id,
  }));
  const appointments: LogRow[] = state.appointments.map((a) => ({
    id: `log-${a.id}`,
    at: `${a.date}T${a.time}:00`,
    kind: 'booked',
    module: 'appointments',
    subject: a.center,
    ref: a.id,
  }));
  const documents: LogRow[] = state.documents.map((d) => ({
    id: `log-${d.id}`,
    at: d.uploadedAt,
    kind: 'uploaded',
    module: 'documents',
    subject: d.title,
    ref: d.id,
  }));
  return [...live, ...requests, ...appointments, ...documents].sort((x, y) =>
    y.at.localeCompare(x.at),
  );
}

export function filterByModule(rows: LogRow[], module: LogModule | 'all'): LogRow[] {
  return module === 'all' ? rows : rows.filter((r) => r.module === module);
}
