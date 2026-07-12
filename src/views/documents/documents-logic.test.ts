import { describe, it, expect } from 'vitest';
import { kindOf, zoomCols, toDocument } from './documents-logic';

describe('documents logic', () => {
  it('kindOf maps extensions', () => {
    expect(kindOf('site-plan.pdf')).toBe('pdf');
    expect(kindOf('photo.JPG')).toBe('image');
    expect(kindOf('report.xlsx')).toBe('sheet');
    expect(kindOf('data.csv')).toBe('sheet');
    expect(kindOf('unknown.bin')).toBe('pdf');
  });

  it('zoomCols clamps to 1..4', () => {
    expect(zoomCols(1)).toBe('lg:grid-cols-6');
    expect(zoomCols(4)).toBe('lg:grid-cols-2');
    expect(zoomCols(9)).toBe('lg:grid-cols-2');
    expect(zoomCols(0)).toBe('lg:grid-cols-6');
  });

  it('toDocument derives kind/size/title from the File', () => {
    const file = new File([new Uint8Array(2048)], 'survey.csv');
    const doc = toDocument(file, 3);
    expect(doc).toMatchObject({ id: 'doc-live-3', kind: 'sheet', sizeKB: 2 });
    expect(doc.title.en).toBe('survey.csv');
  });
});
