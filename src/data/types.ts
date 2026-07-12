import type { Bilingual } from '@/i18n';

export type ServiceCategory = 'permits' | 'licenses' | 'certificates' | 'inspections';
export type RequestStatus = 'new' | 'in_review' | 'approved' | 'rejected' | 'completed';
export type Priority = 'low' | 'normal' | 'high' | 'urgent';
export type Channel = 'web' | 'center' | 'phone';
export type AppointmentStatus = 'booked' | 'completed' | 'cancelled' | 'no_show';
export type DocumentKind = 'image' | 'pdf' | 'sheet';
export type Department = 'permits' | 'licenses' | 'inspections' | 'support';
export type ActivityKind =
  | 'submitted'
  | 'approved'
  | 'rejected'
  | 'assigned'
  | 'completed'
  | 'booked'
  | 'uploaded'
  | 'commented';

export interface Service {
  id: string;
  slug: string;
  category: ServiceCategory;
  name: Bilingual;
  summary: Bilingual;
  description: Bilingual;
  fee: number;
  slaDays: number;
  rating: number;
  ratingsCount: number;
  steps: Bilingual[];
  faq: { q: Bilingual; a: Bilingual }[];
}

export interface Attachment {
  id: string;
  name: string;
  sizeKB: number;
}

export interface ServiceRequest {
  id: string;
  serviceId: string;
  applicant: { name: Bilingual; nationalId: string; phone: string };
  district: Bilingual;
  status: RequestStatus;
  priority: Priority;
  channel: Channel;
  assigneeId: string | null;
  submittedAt: string;
  neededBy: string | null;
  quantity: number;
  urgent: boolean;
  tags: string[];
  notes: string;
  attachments: Attachment[];
  comments?: RequestComment[];
}

export interface RequestComment {
  id: string;
  at: string;
  author: Bilingual;
  text: string;
}

export interface StaffMember {
  id: string;
  name: Bilingual;
  role: Bilingual;
  department: Department;
  initials: string;
  rating: number;
  onShift: boolean;
  email: string;
  joinedAt: string;
  resolved: number;
  quote: Bilingual;
}

export interface Appointment {
  id: string;
  serviceId: string;
  citizen: Bilingual;
  center: Bilingual;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMin: number;
  status: AppointmentStatus;
}

export interface DocumentAsset {
  id: string;
  title: Bilingual;
  kind: DocumentKind;
  sizeKB: number;
  uploadedAt: string;
  uploadedBy: string;
  tags: string[];
}

export interface ActivityEvent {
  id: string;
  at: string;
  kind: ActivityKind;
  text: Bilingual;
}
