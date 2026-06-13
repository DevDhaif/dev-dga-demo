import servicesJson from './services.json';
import requestsJson from './requests.json';
import staffJson from './staff.json';
import appointmentsJson from './appointments.json';
import documentsJson from './documents.json';
import activityJson from './activity.json';
import type {
  Service,
  ServiceRequest,
  StaffMember,
  Appointment,
  DocumentAsset,
  ActivityEvent,
} from './types';

export const DEMO_TODAY = '2026-06-10';

export const services = servicesJson as Service[];
export const requests = requestsJson as unknown as ServiceRequest[];
export const staff = staffJson as unknown as StaffMember[];
export const appointments = appointmentsJson as unknown as Appointment[];
export const documents = documentsJson as unknown as DocumentAsset[];
export const activity = activityJson as unknown as ActivityEvent[];

export const serviceById = (id: string): Service | undefined => services.find((s) => s.id === id);
export const serviceBySlug = (slug: string): Service | undefined =>
  services.find((s) => s.slug === slug);
export const staffById = (id: string): StaffMember | undefined => staff.find((m) => m.id === id);
