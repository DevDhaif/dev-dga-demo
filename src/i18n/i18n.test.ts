import { describe, it, expect } from 'vitest';
import en from './en.json';
import ar from './ar.json';
import { translate, dirToLang, tField } from './index';

describe('i18n catalogs', () => {
  it('en and ar have identical key sets', () => {
    const enKeys = Object.keys(en).sort();
    const arKeys = Object.keys(ar).sort();
    expect(arKeys).toEqual(enKeys);
  });

  it('no empty values in either catalog', () => {
    for (const cat of [en, ar]) {
      for (const [key, value] of Object.entries(cat)) {
        expect(value, `empty value for ${key}`).not.toBe('');
      }
    }
  });

  it('translates per language', () => {
    expect(translate('en', 'nav.requests')).toBe('Requests');
    expect(translate('ar', 'nav.requests')).toBe('الطلبات');
  });

  it('interpolates {name} params', () => {
    expect(translate('en', 'app.name')).toBe('Masar');
  });

  it('dirToLang maps ltr->en, rtl->ar', () => {
    expect(dirToLang('ltr')).toBe('en');
    expect(dirToLang('rtl')).toBe('ar');
  });

  it('tField resolves bilingual fixture fields', () => {
    const f = { en: 'Permit', ar: 'تصريح' };
    expect(tField(f, 'en')).toBe('Permit');
    expect(tField(f, 'ar')).toBe('تصريح');
  });
});
