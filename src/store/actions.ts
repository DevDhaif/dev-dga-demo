import type {
  Appointment,
  AppointmentStatus,
  ActivityEvent,
  ActivityKind,
  DocumentAsset,
  RequestComment,
  RequestStatus,
  ServiceRequest,
} from '@/data/types';
import type { Bilingual } from '@/i18n';

export type Action =
  | { type: 'request/submit'; request: ServiceRequest; activity?: ActivityEvent }
  | {
      type: 'request/update';
      id: string;
      patch: Partial<Omit<ServiceRequest, 'id'>>;
      activity?: ActivityEvent;
    }
  | { type: 'request/setStatus'; ids: string[]; status: RequestStatus; activity?: ActivityEvent }
  | {
      type: 'request/assign';
      ids: string[];
      assigneeId: string | null;
      activity?: ActivityEvent;
    }
  | { type: 'request/remove'; ids: string[]; activity?: ActivityEvent }
  | { type: 'appointment/book'; appointment: Appointment; activity?: ActivityEvent }
  | {
      type: 'appointment/setStatus';
      id: string;
      status: AppointmentStatus;
      activity?: ActivityEvent;
    }
  | { type: 'document/add'; document: DocumentAsset; activity?: ActivityEvent }
  | { type: 'document/remove'; ids: string[]; activity?: ActivityEvent }
  | { type: 'request/comment'; id: string; comment: RequestComment; activity?: ActivityEvent }
  | { type: 'activity/markRead'; ids: string[] }
  | { type: 'activity/markAllRead' };

let activitySeq = 0;

export function makeActivity(kind: ActivityKind, text: Bilingual): ActivityEvent {
  activitySeq += 1;
  return { id: `act-live-${activitySeq}`, at: new Date().toISOString(), kind, text };
}
