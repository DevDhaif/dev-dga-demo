import { describe, it, expect } from 'vitest';
import * as DDGA from '@dev-dga/react';

const modules = import.meta.glob('/src/**/*.{ts,tsx}', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const sources = Object.entries(modules)
  .filter(([path]) => !/\.test\.|coverage/.test(path))
  .map(([, content]) => content)
  .join('\n');

const componentExports = Object.keys(DDGA).filter((k) => /^[A-Z]/.test(k));
const used = (name: string) => new RegExp(`\\b${name}\\b`).test(sources);

describe('@dev-dga component coverage', () => {
  it('uses every @dev-dga component family in src/', () => {
    const baseOf = (name: string) =>
      componentExports.filter((b) => name.startsWith(b)).sort((a, b) => a.length - b.length)[0];
    const usedBases = new Set(componentExports.filter(used).map(baseOf));
    const uncovered = componentExports.filter((name) => !usedBases.has(baseOf(name)));
    expect(uncovered).toEqual([]);
  });

  it('references a large majority of all exports', () => {
    const usedCount = componentExports.filter(used).length;
    expect(usedCount).toBeGreaterThan(componentExports.length * 0.6);
  });
});
