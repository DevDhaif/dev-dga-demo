import type { DocumentAsset, DocumentKind } from '@/data/types';
import { DEMO_TODAY } from '@/data/fixtures';

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg)$/i;
const SHEET_EXT = /\.(xlsx?|csv|ods)$/i;

export function kindOf(filename: string): DocumentKind {
  if (IMAGE_EXT.test(filename)) return 'image';
  if (SHEET_EXT.test(filename)) return 'sheet';
  return 'pdf';
}

export function zoomCols(zoom: number): string {
  const cols = {
    1: 'lg:grid-cols-6',
    2: 'lg:grid-cols-4',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-2',
  };
  return cols[Math.min(4, Math.max(1, Math.round(zoom))) as 1 | 2 | 3 | 4];
}

export function toDocument(file: File, seq: number): DocumentAsset {
  return {
    id: `doc-live-${seq}`,
    title: { en: file.name, ar: file.name },
    kind: kindOf(file.name),
    sizeKB: Math.max(1, Math.round(file.size / 1024)),
    uploadedAt: `${DEMO_TODAY}T12:00:00Z`,
    uploadedBy: 'st-01',
    tags: ['upload'],
  };
}
