import { useCallback } from 'react';
import en from './en.json';
import ar from './ar.json';
import { useUiPrefsContext } from '@/app/ui-prefs-context';
import type { Dir } from '@/app/use-ui-prefs';

export type I18nKey = keyof typeof en;
export type Lang = 'en' | 'ar';

export interface Bilingual {
  en: string;
  ar: string;
}

const catalogs: Record<Lang, Record<I18nKey, string>> = { en, ar };

export function dirToLang(dir: Dir): Lang {
  return dir === 'rtl' ? 'ar' : 'en';
}

export type TParams = Record<string, string | number>;

export function translate(lang: Lang, key: I18nKey, params?: TParams): string {
  let out = catalogs[lang][key];
  if (params) {
    for (const [name, value] of Object.entries(params)) {
      out = out.replaceAll(`{${name}}`, String(value));
    }
  }
  return out;
}

export function tField(field: Bilingual, lang: Lang): string {
  return field[lang];
}

export function useLang(): Lang {
  return dirToLang(useUiPrefsContext().dir);
}

export function useT() {
  const lang = useLang();
  return useCallback((key: I18nKey, params?: TParams) => translate(lang, key, params), [lang]);
}
