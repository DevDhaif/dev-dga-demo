/* eslint-disable react-refresh/only-export-components -- context module: StoreProvider + useStore hook intentionally co-located */
import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react';
import { reducer } from './reducer';
import { seedState, type AppState } from './state';
import type { Action } from './actions';

interface StoreValue {
  state: AppState;
  dispatch: Dispatch<Action>;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children, initial }: { children: ReactNode; initial?: AppState }) {
  const [state, dispatch] = useReducer(reducer, initial, (i) => i ?? seedState());
  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within a StoreProvider');
  return ctx;
}
