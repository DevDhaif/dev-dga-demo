import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { DgaProvider } from '@dev-dga/react';
import { router } from './router';
import { useUiPrefs } from './app/use-ui-prefs';
import { UiPrefsContext } from './app/ui-prefs-context';
import { AuthProvider } from './app/use-auth';
import { StoreProvider } from './store/store-context';

export function AppRoot() {
  const prefs = useUiPrefs();

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('data-theme', prefs.mode);
    html.style.colorScheme = prefs.mode;
    html.setAttribute('dir', prefs.dir);
    html.setAttribute('lang', prefs.dir === 'rtl' ? 'ar' : 'en');
  }, [prefs.mode, prefs.dir]);

  return (
    <UiPrefsContext.Provider value={prefs}>
      <DgaProvider
        dir={prefs.dir}
        mode={prefs.mode}
        theme={prefs.brand === 'saGreen' ? undefined : { primary: prefs.brand }}
      >
        <AuthProvider>
          <StoreProvider>
            <RouterProvider router={router} />
          </StoreProvider>
        </AuthProvider>
      </DgaProvider>
    </UiPrefsContext.Provider>
  );
}
