import { makeActivity } from '@/store/actions';
import type { ActivityEvent } from '@/data/types';
import type { Bilingual } from '@/i18n';

const list = (ids: string[], ar = false) => ids.join(ar ? '، ' : ', ');

export function approvedActivity(ids: string[]): ActivityEvent {
  return makeActivity('approved', {
    en: `${list(ids)} approved`,
    ar: `تم اعتماد ${list(ids, true)}`,
  });
}

export function rejectedActivity(ids: string[]): ActivityEvent {
  return makeActivity('rejected', {
    en: `${list(ids)} rejected`,
    ar: `تم رفض ${list(ids, true)}`,
  });
}

export function assignedActivity(ids: string[], assignee: Bilingual): ActivityEvent {
  return makeActivity('assigned', {
    en: `${list(ids)} assigned to ${assignee.en}`,
    ar: `تم إسناد ${list(ids, true)} إلى ${assignee.ar}`,
  });
}
