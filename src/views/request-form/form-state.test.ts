import { describe, it, expect } from 'vitest';
import { requests } from '@/data/fixtures';
import { blankForm, toForm, validateStep, formReducer } from './form-state';
import { toRequest } from './form-request';

const r0101 = requests.find((r) => r.id === 'REQ-2026-0101')!;

describe('form-state', () => {
  it('blank form is invalid at step 0 and review', () => {
    const d = blankForm();
    expect(validateStep(d, 0)).toBe(false);
    expect(validateStep(d, 3)).toBe(false);
  });

  it('filled applicant step validates (10-digit national id starting 1)', () => {
    const d = { ...blankForm(), name: 'Test', nationalId: '1234567890', phone: '+966500000000' };
    expect(validateStep(d, 0)).toBe(true);
    expect(validateStep({ ...d, nationalId: '2234567890' }, 0)).toBe(false);
    expect(validateStep({ ...d, nationalId: '123' }, 0)).toBe(false);
  });

  it('details step needs service, district and channel', () => {
    const d = { ...blankForm(), serviceId: 'svc-x', district: 'Al-Olaya', channel: 'web' as const };
    expect(validateStep(d, 1)).toBe(true);
    expect(validateStep({ ...d, district: '' }, 1)).toBe(false);
  });

  it('urgent switch forces priority urgent, and back', () => {
    let d = formReducer(blankForm(), { type: 'setUrgent', urgent: true });
    expect(d.priority).toBe('urgent');
    d = formReducer(d, { type: 'setUrgent', urgent: false });
    expect(d.priority).toBe('normal');
    d = formReducer(d, { type: 'setPriority', priority: 'urgent' });
    expect(d.urgent).toBe(true);
  });

  it('next is guarded by the current step validity', () => {
    const stuck = formReducer(blankForm(), { type: 'next' });
    expect(stuck.step).toBe(0);
    const valid = { ...blankForm(), name: 'T', nationalId: '1000000001', phone: '+966500000001' };
    expect(formReducer(valid, { type: 'next' }).step).toBe(1);
    expect(formReducer(valid, { type: 'back' }).step).toBe(0);
  });

  it('toForm round-trips REQ-2026-0101 through toRequest', () => {
    const draft = toForm(r0101);
    expect(draft.nationalId).toBe(r0101.applicant.nationalId);
    expect(draft.serviceId).toBe(r0101.serviceId);
    expect(draft.district).toBe(r0101.district.en);
    const back = toRequest(draft, r0101, 999, []);
    expect(back.id).toBe('REQ-2026-0101');
    expect(back.applicant.name).toEqual(r0101.applicant.name);
    expect(back.status).toBe(r0101.status);
    expect(back.neededBy).toBe(r0101.neededBy ? r0101.neededBy.slice(0, 10) : null);
    expect(back.tags).toEqual(r0101.tags);
  });

  it('toRequest builds a fresh new-request with sequential id', () => {
    const d = {
      ...blankForm(),
      name: 'Test Person',
      nationalId: '1555555555',
      phone: '+966511111111',
      serviceId: 'svc-x',
      district: 'Al-Malaz',
      channel: 'center' as const,
    };
    const built = toRequest(d, undefined, 129, [{ id: 'att-1', name: 'plan.pdf', sizeKB: 100 }]);
    expect(built.id).toBe('REQ-2026-0129');
    expect(built.status).toBe('new');
    expect(built.assigneeId).toBeNull();
    expect(built.district.ar).toBe('الملز');
    expect(built.attachments).toHaveLength(1);
  });
});
