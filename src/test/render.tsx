import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider, type RouteObject } from 'react-router-dom';
import { DgaProvider } from '@dev-dga/react';
import { UiPrefsContext } from '@/app/ui-prefs-context';
import type { Dir, Mode } from '@/app/use-ui-prefs';
import { AuthProvider } from '@/app/use-auth';
import { StoreProvider } from '@/store/store-context';
import type { AppState } from '@/store/state';

export interface RenderViewOptions {
  dir?: Dir;
  mode?: Mode;
  /** Route pattern (e.g. '/requests/:id'). When set, ui renders inside a memory router. */
  path?: string;
  /** Initial URL; defaults to `path`. Required when `path` has params. */
  route?: string;
  /** Store seed override; defaults to the fixture-seeded state. */
  state?: AppState;
  /** Auth state; views assume a signed-in session by default. */
  authed?: boolean;
  /** Additional routes (e.g. a navigation target the test asserts on). */
  extraRoutes?: RouteObject[];
}

/** Shared harness: UiPrefs + Dga + Auth + Store (+ memory router when `path` given). */
export function renderView(
  ui: ReactElement,
  {
    dir = 'ltr',
    mode = 'light',
    path,
    route,
    state,
    authed = true,
    extraRoutes = [],
  }: RenderViewOptions = {},
) {
  const prefs = {
    dir,
    mode,
    brand: 'saGreen' as const,
    toggleDir: () => {},
    toggleMode: () => {},
    setBrand: () => {},
  };
  const inner = path ? (
    <RouterProvider
      router={createMemoryRouter([{ path, element: ui }, ...extraRoutes], {
        initialEntries: [route ?? path],
      })}
    />
  ) : (
    ui
  );
  return render(
    <UiPrefsContext.Provider value={prefs}>
      <DgaProvider dir={dir} mode={mode}>
        <AuthProvider initial={authed}>
          <StoreProvider initial={state}>{inner}</StoreProvider>
        </AuthProvider>
      </DgaProvider>
    </UiPrefsContext.Provider>,
  );
}
