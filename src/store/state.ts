import { requests, appointments, documents, activity } from '@/data/fixtures';
import type { ActivityEvent, Appointment, DocumentAsset, ServiceRequest } from '@/data/types';

export type { ActivityEvent };

export interface AppState {
  requests: ServiceRequest[];
  appointments: Appointment[];
  documents: DocumentAsset[];
  activity: ActivityEvent[];
  readActivity: string[];
}

export function seedState(): AppState {
  return {
    requests: [...requests],
    appointments: [...appointments],
    documents: [...documents],
    activity: [...activity],
    readActivity: [],
  };
}
