import { describe, it, expect } from 'vitest';
import { staff } from '@/data/fixtures';
import { filterStaff, type StaffFilter } from './staff-logic';

const base: StaffFilter = {
  query: '',
  lang: 'en',
  department: 'all',
  showOffShift: true,
  page: 1,
  pageSize: 6,
};

describe('filterStaff (fixture-pinned)', () => {
  it('all 10 paged at 6 -> 2 pages', () => {
    const { total, pageCount, rows } = filterStaff(staff, base);
    expect(total).toBe(10);
    expect(pageCount).toBe(2);
    expect(rows).toHaveLength(6);
  });

  it('hiding off-shift leaves the 6 on-shift members', () => {
    expect(filterStaff(staff, { ...base, showOffShift: false }).total).toBe(6);
  });

  it('department filter pins fixture counts', () => {
    expect(filterStaff(staff, { ...base, department: 'permits' }).total).toBe(3);
    expect(filterStaff(staff, { ...base, department: 'support' }).total).toBe(2);
  });

  it('query matches name in the active language', () => {
    const first = staff[0];
    expect(
      filterStaff(staff, { ...base, query: first.name.en.split(' ')[0] }).total,
    ).toBeGreaterThanOrEqual(1);
    expect(
      filterStaff(staff, { ...base, lang: 'ar', query: first.name.ar.slice(0, 4) }).total,
    ).toBeGreaterThanOrEqual(1);
  });
});
