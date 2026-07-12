import { useCallback, useEffect, useState } from 'react';

export type Dir = 'ltr' | 'rtl';
export type Mode = 'light' | 'dark';
export type Brand = 'saGreen' | 'gold' | 'lavender' | 'info';

export const BRANDS: Brand[] = ['saGreen', 'gold', 'lavender', 'info'];

const KEY = 'masar.ui-prefs';

interface UiPrefs {
  dir: Dir;
  mode: Mode;
  brand: Brand;
}

function read(): UiPrefs {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<UiPrefs>;
      return {
        dir: parsed.dir === 'ltr' ? 'ltr' : 'rtl',
        mode: parsed.mode === 'dark' ? 'dark' : 'light',
        brand: BRANDS.includes(parsed.brand as Brand) ? (parsed.brand as Brand) : 'saGreen',
      };
    }
  } catch {
    // localStorage unavailable or corrupt — fall through to defaults
  }
  return { dir: 'rtl', mode: 'light', brand: 'saGreen' };
}

export function useUiPrefs() {
  const [prefs, setPrefs] = useState<UiPrefs>(read);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(prefs));
  }, [prefs]);

  const toggleDir = useCallback(
    () => setPrefs((p) => ({ ...p, dir: p.dir === 'ltr' ? 'rtl' : 'ltr' })),
    [],
  );
  const toggleMode = useCallback(
    () => setPrefs((p) => ({ ...p, mode: p.mode === 'light' ? 'dark' : 'light' })),
    [],
  );
  const setBrand = useCallback((brand: Brand) => setPrefs((p) => ({ ...p, brand })), []);

  return { dir: prefs.dir, mode: prefs.mode, brand: prefs.brand, toggleDir, toggleMode, setBrand };
}
