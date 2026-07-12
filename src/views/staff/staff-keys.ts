import type { Department } from '@/data/types';
import type { I18nKey } from '@/i18n';

export const DEPT_KEY: Record<Department, I18nKey> = {
  permits: 'dept.permits',
  licenses: 'dept.licenses',
  inspections: 'dept.inspections',
  support: 'dept.support',
};
