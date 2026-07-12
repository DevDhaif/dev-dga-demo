import { describe, it, expect } from 'vitest';
import { filterServices, relatedServices } from './catalog-logic';
import { services, serviceBySlug } from '@/data/fixtures';

describe('filterServices', () => {
  it('passes all 8 services through with no query and category "all"', () => {
    expect(filterServices(services, '', 'en', 'all')).toHaveLength(8);
  });

  it('narrows to exactly 2 per category', () => {
    expect(filterServices(services, '', 'en', 'permits').map((s) => s.slug)).toEqual([
      'building-permit',
      'demolition-permit',
    ]);
    expect(filterServices(services, '', 'en', 'licenses')).toHaveLength(2);
    expect(filterServices(services, '', 'en', 'certificates')).toHaveLength(2);
    expect(filterServices(services, '', 'en', 'inspections')).toHaveLength(2);
  });

  it('matches English names case-insensitively', () => {
    expect(filterServices(services, 'building permit', 'en', 'all').map((s) => s.slug)).toEqual([
      'building-permit',
    ]);
    expect(filterServices(services, 'Permit', 'en', 'all').map((s) => s.slug)).toEqual([
      'building-permit',
      'demolition-permit',
    ]);
  });

  it('matches Arabic names when lang is ar', () => {
    expect(filterServices(services, 'تصريح', 'ar', 'all').map((s) => s.slug)).toEqual([
      'building-permit',
      'demolition-permit',
    ]);
    expect(filterServices(services, 'رخصة', 'ar', 'all')).toHaveLength(2);
    expect(filterServices(services, 'permit', 'ar', 'all')).toHaveLength(0);
  });

  it('combines query and category', () => {
    expect(filterServices(services, 'permit', 'en', 'licenses')).toHaveLength(0);
    expect(filterServices(services, 'health', 'en', 'certificates').map((s) => s.slug)).toEqual([
      'health-certificate',
    ]);
  });
});

describe('relatedServices', () => {
  it('puts the same-category sibling first, then fills to 3 in fixture order', () => {
    const current = serviceBySlug('building-permit')!;
    expect(relatedServices(services, current).map((s) => s.slug)).toEqual([
      'demolition-permit',
      'commercial-license',
      'food-truck-license',
    ]);
  });

  it('never includes the current service', () => {
    const current = serviceBySlug('site-inspection')!;
    const related = relatedServices(services, current);
    expect(related).toHaveLength(3);
    expect(related.map((s) => s.slug)).not.toContain('site-inspection');
    expect(related[0].slug).toBe('facility-safety-inspection');
  });
});
