import type { LogModule } from './activity-log';

export interface LogView {
  module: LogModule | 'all';
  cols: { module: boolean; ref: boolean };
  density: 'md' | 'sm';
}

export const initialLogView: LogView = {
  module: 'all',
  cols: { module: true, ref: true },
  density: 'md',
};
