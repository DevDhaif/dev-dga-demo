import { createContext, useContext } from 'react';
import type { useUiPrefs } from './use-ui-prefs';

type UiPrefsValue = ReturnType<typeof useUiPrefs>;

export const UiPrefsContext = createContext<UiPrefsValue | null>(null);

export function useUiPrefsContext(): UiPrefsValue {
  const ctx = useContext(UiPrefsContext);
  if (!ctx) {
    throw new Error('useUiPrefsContext must be used within a UiPrefsContext.Provider');
  }
  return ctx;
}
