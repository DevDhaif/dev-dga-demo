import { describe, it, expect } from 'vitest';
import { reducer } from './reducer';
import type { AppState } from './state';
import type { Appointment, DocumentAsset, ServiceRequest } from '@/data/types';

const req = (id: string, over: Partial<ServiceRequest> = {}): ServiceRequest => ({
  id,
  serviceId: 'svc-x',
  applicant: { name: { en: 'A', ar: 'أ' }, nationalId: '1000000000', phone: '+966500000000' },
  district: { en: 'Al-Olaya', ar: 'العليا' },
  status: 'new',
  priority: 'normal',
  channel: 'web',
  assigneeId: null,
  submittedAt: '2026-06-01T08:00:00Z',
  neededBy: null,
  quantity: 1,
  urgent: false,
  tags: [],
  notes: '',
  attachments: [],
  ...over,
});

const apt = (id: string, over: Partial<Appointment> = {}): Appointment => ({
  id,
  serviceId: 'svc-x',
  citizen: { en: 'C', ar: 'م' },
  center: { en: 'North Center', ar: 'مركز الشمال' },
  date: '2026-06-10',
  time: '09:00',
  durationMin: 30,
  status: 'booked',
  ...over,
});

const doc = (id: string): DocumentAsset => ({
  id,
  title: { en: 'Form', ar: 'نموذج' },
  kind: 'pdf',
  sizeKB: 100,
  uploadedAt: '2026-06-01T08:00:00Z',
  uploadedBy: 'st-01',
  tags: [],
});

const base = (): AppState => ({
  requests: [req('REQ-1'), req('REQ-2', { status: 'in_review', assigneeId: 'st-01' })],
  appointments: [apt('apt-1')],
  documents: [doc('doc-1')],
  activity: [],
  readActivity: [],
});

describe('reducer', () => {
  it('request/submit prepends and logs activity', () => {
    const s = reducer(base(), {
      type: 'request/submit',
      request: req('REQ-3'),
      activity: {
        id: 'a1',
        at: '2026-06-10T09:00:00Z',
        kind: 'submitted',
        text: { en: 'x', ar: 'س' },
      },
    });
    expect(s.requests.map((r) => r.id)).toEqual(['REQ-3', 'REQ-1', 'REQ-2']);
    expect(s.activity).toHaveLength(1);
  });

  it('request/update patches only the target', () => {
    const s = reducer(base(), { type: 'request/update', id: 'REQ-1', patch: { priority: 'high' } });
    expect(s.requests[0].priority).toBe('high');
    expect(s.requests[1].priority).toBe('normal');
  });

  it('request/setStatus updates all ids', () => {
    const s = reducer(base(), {
      type: 'request/setStatus',
      ids: ['REQ-1', 'REQ-2'],
      status: 'approved',
    });
    expect(s.requests.every((r) => r.status === 'approved')).toBe(true);
  });

  it('request/assign sets assignee on the listed ids only', () => {
    const s = reducer(base(), { type: 'request/assign', ids: ['REQ-1'], assigneeId: 'st-05' });
    expect(s.requests[0].assigneeId).toBe('st-05');
    expect(s.requests[1].assigneeId).toBe('st-01');
  });

  it('request/remove drops the listed ids', () => {
    const s = reducer(base(), { type: 'request/remove', ids: ['REQ-1'] });
    expect(s.requests.map((r) => r.id)).toEqual(['REQ-2']);
  });

  it('appointment/book + setStatus', () => {
    let s = reducer(base(), {
      type: 'appointment/book',
      appointment: apt('apt-2', { time: '10:00' }),
    });
    expect(s.appointments).toHaveLength(2);
    s = reducer(s, { type: 'appointment/setStatus', id: 'apt-1', status: 'cancelled' });
    expect(s.appointments.find((a) => a.id === 'apt-1')!.status).toBe('cancelled');
  });

  it('document/add + remove', () => {
    let s = reducer(base(), { type: 'document/add', document: doc('doc-2') });
    expect(s.documents.map((d) => d.id)).toEqual(['doc-2', 'doc-1']);
    s = reducer(s, { type: 'document/remove', ids: ['doc-1'] });
    expect(s.documents.map((d) => d.id)).toEqual(['doc-2']);
  });

  it('request/comment appends to the request and logs activity', () => {
    const comment = {
      id: 'c1',
      at: '2026-06-11T10:00:00Z',
      author: { en: 'Reviewer', ar: 'المراجع' },
      text: 'Looks complete.',
    };
    const s = reducer(base(), {
      type: 'request/comment',
      id: 'REQ-1',
      comment,
      activity: {
        id: 'a9',
        at: '2026-06-11T10:00:00Z',
        kind: 'commented',
        text: { en: 'c', ar: 'ت' },
      },
    });
    expect(s.requests.find((r) => r.id === 'REQ-1')?.comments).toEqual([comment]);
    expect(s.requests.find((r) => r.id === 'REQ-2')?.comments).toBeUndefined();
    expect(s.activity[0]?.id).toBe('a9');
  });

  it('activity/markRead dedupes; markAllRead covers every event', () => {
    const withActivity: AppState = {
      ...base(),
      activity: [
        { id: 'a1', at: '2026-06-10T08:00:00Z', kind: 'submitted', text: { en: 'x', ar: 'س' } },
        { id: 'a2', at: '2026-06-10T09:00:00Z', kind: 'approved', text: { en: 'y', ar: 'ص' } },
      ],
      readActivity: ['a1'],
    };
    let s = reducer(withActivity, { type: 'activity/markRead', ids: ['a1', 'a2'] });
    expect(s.readActivity).toEqual(['a1', 'a2']);
    s = reducer({ ...withActivity, readActivity: [] }, { type: 'activity/markAllRead' });
    expect(s.readActivity).toEqual(['a1', 'a2']);
  });

  it('does not mutate the previous state', () => {
    const before = base();
    const snapshot = JSON.parse(JSON.stringify(before));
    reducer(before, { type: 'request/setStatus', ids: ['REQ-1'], status: 'rejected' });
    expect(before).toEqual(snapshot);
  });
});
