export interface Paged<T> {
  rows: T[];
  total: number;
  pageCount: number;
}

export function paginate<T>(rows: T[], page: number, pageSize: number): Paged<T> {
  const total = rows.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const clamped = Math.min(Math.max(1, page), pageCount);
  return { rows: rows.slice((clamped - 1) * pageSize, clamped * pageSize), total, pageCount };
}
