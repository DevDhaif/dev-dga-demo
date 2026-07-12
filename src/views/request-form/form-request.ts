import type { ServiceRequest } from '@/data/types';
import { DEMO_TODAY } from '@/data/fixtures';
import { DISTRICTS, type FormDraft } from './form-state';

const dateOnly = (v: Date): string => {
  const y = v.getFullYear();
  const m = String(v.getMonth() + 1).padStart(2, '0');
  const day = String(v.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export function toRequest(
  d: FormDraft,
  existing: ServiceRequest | undefined,
  nextSeq: number,
  attachments: ServiceRequest['attachments'],
): ServiceRequest {
  const id = existing?.id ?? `REQ-2026-${String(nextSeq).padStart(4, '0')}`;
  return {
    id,
    serviceId: d.serviceId,
    applicant: {
      name:
        existing?.applicant.name.en === d.name
          ? existing.applicant.name
          : { en: d.name, ar: d.name },
      nationalId: d.nationalId,
      phone: d.phone,
    },
    district: DISTRICTS.find((x) => x.en === d.district) ?? { en: d.district, ar: d.district },
    status: existing?.status ?? 'new',
    priority: d.priority,
    channel: d.channel === '' ? 'web' : d.channel,
    assigneeId: existing?.assigneeId ?? null,
    submittedAt: existing?.submittedAt ?? `${DEMO_TODAY}T12:00:00Z`,
    neededBy: d.neededBy ? dateOnly(d.neededBy) : null,
    quantity: d.quantity,
    urgent: d.urgent,
    tags: d.tags,
    notes: d.notes,
    attachments: existing ? [...existing.attachments, ...attachments] : attachments,
  };
}
