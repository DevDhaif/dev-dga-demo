import type { Department, StaffMember } from '@/data/types';
import type { Lang } from '@/i18n';
import { paginate, type Paged } from '@/store/paging';

export interface StaffFilter {
  query: string;
  lang: Lang;
  department: Department | 'all';
  showOffShift: boolean;
  page: number;
  pageSize: number;
}

export function filterStaff(staff: StaffMember[], f: StaffFilter): Paged<StaffMember> {
  const q = f.query.trim().toLowerCase();
  const rows = staff.filter(
    (m) =>
      (f.department === 'all' || m.department === f.department) &&
      (f.showOffShift || m.onShift) &&
      (q === '' ||
        m.name[f.lang].toLowerCase().includes(q) ||
        m.role[f.lang].toLowerCase().includes(q)),
  );
  return paginate(rows, f.page, f.pageSize);
}
