import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUiPrefs } from './use-ui-prefs';

const KEY = 'masar.ui-prefs';

describe('useUiPrefs', () => {
  beforeEach(() => localStorage.clear());

  it('defaults to rtl/light (Arabic-first)', () => {
    const { result } = renderHook(() => useUiPrefs());
    expect(result.current.dir).toBe('rtl');
    expect(result.current.mode).toBe('light');
  });

  it('toggles dir and mode and persists to localStorage', () => {
    const { result } = renderHook(() => useUiPrefs());
    act(() => result.current.toggleDir());
    act(() => result.current.toggleMode());
    expect(result.current.dir).toBe('ltr');
    expect(result.current.mode).toBe('dark');
    expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual({
      dir: 'ltr',
      mode: 'dark',
      brand: 'saGreen',
    });
  });

  it('persists the brand and falls back to saGreen on junk', () => {
    const { result } = renderHook(() => useUiPrefs());
    expect(result.current.brand).toBe('saGreen');
    act(() => result.current.setBrand('lavender'));
    expect(JSON.parse(localStorage.getItem(KEY)!).brand).toBe('lavender');

    localStorage.setItem(KEY, JSON.stringify({ brand: 'hotpink' }));
    const { result: reread } = renderHook(() => useUiPrefs());
    expect(reread.current.brand).toBe('saGreen');
  });

  it('seeds from existing localStorage', () => {
    localStorage.setItem(KEY, JSON.stringify({ dir: 'rtl', mode: 'dark' }));
    const { result } = renderHook(() => useUiPrefs());
    expect(result.current.dir).toBe('rtl');
    expect(result.current.mode).toBe('dark');
  });

  it('ignores malformed storage', () => {
    localStorage.setItem(KEY, '{not json');
    const { result } = renderHook(() => useUiPrefs());
    expect(result.current.dir).toBe('rtl');
    expect(result.current.mode).toBe('light');
  });
});
