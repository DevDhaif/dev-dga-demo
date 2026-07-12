import type { Service, ServiceCategory } from '@/data/types';
import type { Lang } from '@/i18n';

export type CategoryFilter = ServiceCategory | 'all';

export function filterServices(
  list: Service[],
  query: string,
  lang: Lang,
  category: CategoryFilter,
): Service[] {
  const q = query.trim().toLowerCase();
  return list.filter(
    (s) =>
      (category === 'all' || s.category === category) &&
      (q === '' || s.name[lang].toLowerCase().includes(q)),
  );
}

export function relatedServices(list: Service[], current: Service, limit = 3): Service[] {
  const others = list.filter((s) => s.id !== current.id);
  return [
    ...others.filter((s) => s.category === current.category),
    ...others.filter((s) => s.category !== current.category),
  ].slice(0, limit);
}
