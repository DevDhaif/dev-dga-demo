import type {
  AppointmentStatus,
  Channel,
  DocumentKind,
  Priority,
  RequestStatus,
  ServiceCategory,
} from './types';
import type { I18nKey } from '@/i18n';

export type TagVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'destructive'
  | 'destructive-subtle'
  | 'success'
  | 'success-subtle'
  | 'warning'
  | 'warning-subtle'
  | 'info'
  | 'info-subtle'
  | 'primary-subtle'
  | 'secondary-subtle';

export const STATUS_KEY: Record<RequestStatus, I18nKey> = {
  new: 'status.new',
  in_review: 'status.in_review',
  approved: 'status.approved',
  rejected: 'status.rejected',
  completed: 'status.completed',
};

export const STATUS_BADGE: Record<RequestStatus, TagVariant> = {
  new: 'info',
  in_review: 'warning',
  approved: 'success',
  rejected: 'destructive-subtle',
  completed: 'secondary',
};

export type StatusTagTone = 'neutral' | 'info' | 'success' | 'error' | 'warning';

export const STATUS_TONE: Record<RequestStatus, StatusTagTone> = {
  new: 'info',
  in_review: 'warning',
  approved: 'success',
  rejected: 'error',
  completed: 'neutral',
};

export const PRIORITY_KEY: Record<Priority, I18nKey> = {
  low: 'priority.low',
  normal: 'priority.normal',
  high: 'priority.high',
  urgent: 'priority.urgent',
};

export const PRIORITY_BADGE: Record<Priority, TagVariant> = {
  low: 'secondary-subtle',
  normal: 'secondary',
  high: 'warning-subtle',
  urgent: 'destructive',
};

export const CHANNEL_KEY: Record<Channel, I18nKey> = {
  web: 'channel.web',
  center: 'channel.center',
  phone: 'channel.phone',
};

export const CATEGORY_KEY: Record<ServiceCategory, I18nKey> = {
  permits: 'category.permits',
  licenses: 'category.licenses',
  certificates: 'category.certificates',
  inspections: 'category.inspections',
};

export const DOCKIND_KEY: Record<DocumentKind, I18nKey> = {
  image: 'dockind.image',
  pdf: 'dockind.pdf',
  sheet: 'dockind.sheet',
};

export const APTSTATUS_KEY: Record<AppointmentStatus, I18nKey> = {
  booked: 'aptstatus.booked',
  completed: 'aptstatus.completed',
  cancelled: 'aptstatus.cancelled',
  no_show: 'aptstatus.no_show',
};

export const APTSTATUS_BADGE: Record<AppointmentStatus, TagVariant> = {
  booked: 'info',
  completed: 'success',
  cancelled: 'secondary',
  no_show: 'warning',
};

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatSizeKB(kb: number): string {
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
}
