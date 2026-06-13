import type { DocumentAsset, DocumentKind } from '@/data/types';
import type { Lang } from '@/i18n';
import { paginate, type Paged } from './paging';

export interface DocumentFilter {
  query: string;
  lang: Lang;
  kind: DocumentKind | 'all';
  page: number;
  pageSize: number;
}

export function filterDocuments(
  documents: DocumentAsset[],
  f: DocumentFilter,
): Paged<DocumentAsset> {
  const q = f.query.trim().toLowerCase();
  const rows = documents.filter(
    (d) =>
      (f.kind === 'all' || d.kind === f.kind) &&
      (q === '' || d.title[f.lang].toLowerCase().includes(q)),
  );
  return paginate(rows, f.page, f.pageSize);
}
