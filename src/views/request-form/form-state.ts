import type { Channel, Priority, ServiceRequest } from '@/data/types';
import type { Bilingual } from '@/i18n';

export const DISTRICTS: Bilingual[] = [
  { en: 'Al-Olaya', ar: 'العليا' },
  { en: 'Al-Malaz', ar: 'الملز' },
  { en: 'Al-Naseem', ar: 'النسيم' },
  { en: 'Al-Rawdah', ar: 'الروضة' },
  { en: 'Al-Sulaimaniyah', ar: 'السليمانية' },
  { en: 'Al-Murabba', ar: 'المربع' },
];

export const FORM_STEPS = ['applicant', 'details', 'documents', 'review'] as const;
export type FormStep = (typeof FORM_STEPS)[number];

export interface FormDraft {
  name: string;
  nationalId: string;
  phone: string;
  verified: boolean;
  serviceId: string;
  district: string;
  channel: Channel | '';
  neededBy: Date | null;
  quantity: number;
  priority: Priority;
  urgent: boolean;
  tags: string[];
  notes: string;
  step: number;
}

export function blankForm(): FormDraft {
  return {
    name: '',
    nationalId: '',
    phone: '',
    verified: false,
    serviceId: '',
    district: '',
    channel: '',
    neededBy: null,
    quantity: 1,
    priority: 'normal',
    urgent: false,
    tags: [],
    notes: '',
    step: 0,
  };
}

export function toForm(r: ServiceRequest): FormDraft {
  return {
    name: r.applicant.name.en,
    nationalId: r.applicant.nationalId,
    phone: r.applicant.phone,
    verified: true,
    serviceId: r.serviceId,
    district: r.district.en,
    channel: r.channel,
    neededBy: r.neededBy ? new Date(`${r.neededBy.slice(0, 10)}T00:00:00`) : null,
    quantity: r.quantity,
    priority: r.priority,
    urgent: r.urgent,
    tags: r.tags,
    notes: r.notes,
    step: 0,
  };
}

export function validateStep(d: FormDraft, step: number): boolean {
  switch (step) {
    case 0:
      return d.name.trim() !== '' && /^1\d{9}$/.test(d.nationalId) && d.phone.trim().length >= 9;
    case 1:
      return d.serviceId !== '' && d.district !== '' && d.channel !== '';
    case 2:
      return true;
    case 3:
      return validateStep(d, 0) && validateStep(d, 1);
    default:
      return false;
  }
}

export type FormEvent =
  | { type: 'load'; draft: FormDraft }
  | { type: 'set'; patch: Partial<Omit<FormDraft, 'step' | 'urgent' | 'priority'>> }
  | { type: 'setUrgent'; urgent: boolean }
  | { type: 'setPriority'; priority: Priority }
  | { type: 'next' }
  | { type: 'back' };

export function formReducer(d: FormDraft, e: FormEvent): FormDraft {
  switch (e.type) {
    case 'load':
      return e.draft;
    case 'set':
      return { ...d, ...e.patch };
    case 'setUrgent':
      return {
        ...d,
        urgent: e.urgent,
        priority: e.urgent ? 'urgent' : d.priority === 'urgent' ? 'normal' : d.priority,
      };
    case 'setPriority':
      return { ...d, priority: e.priority, urgent: e.priority === 'urgent' };
    case 'next':
      return validateStep(d, d.step) && d.step < FORM_STEPS.length - 1
        ? { ...d, step: d.step + 1 }
        : d;
    case 'back':
      return d.step > 0 ? { ...d, step: d.step - 1 } : d;
  }
}
