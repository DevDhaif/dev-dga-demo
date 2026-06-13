import {
  Button,
  SearchBox,
  Slider,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  EmptyState,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@dev-dga/react';
import type { DocumentKind } from '@/data/types';
import { DOCKIND_KEY } from '@/data/labels';
import { useT } from '@/i18n';
import { useDocuments } from './documents/use-documents';
import { DocumentGrid } from './documents/DocumentGrid';
import { DocumentDrawer } from './documents/DocumentDrawer';
import { UploadModal } from './documents/UploadModal';

const KINDS: (DocumentKind | 'all')[] = ['all', 'image', 'pdf', 'sheet'];

export function DocumentCenter() {
  const t = useT();
  const d = useDocuments();

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0">{t('docs.title')}</h1>
        <Button variant="primary" onClick={() => d.setUploadOpen(true)}>
          {t('docs.upload')}
        </Button>
      </header>

      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-48 flex-1">
          <SearchBox
            value={d.query}
            onChange={(e) => d.setQuery(e.target.value)}
            placeholder={t('docs.searchPlaceholder')}
            aria-label={t('topbar.search')}
          />
        </div>
        <div className="w-40">
          <Slider
            label={t('docs.zoom')}
            min={1}
            max={4}
            step={1}
            value={d.zoom}
            onValueChange={(v) => typeof v === 'number' && d.setZoom(v)}
          />
        </div>
      </div>

      <Tabs value={d.kind} onValueChange={(v) => d.setKind(v as DocumentKind | 'all')}>
        <TabsList>
          {KINDS.map((k) => (
            <TabsTrigger key={k} value={k}>
              {k === 'all' ? t('common.all') : t(DOCKIND_KEY[k])}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={d.kind} className="flex flex-col gap-4 pt-3">
          {d.total === 0 ? <EmptyState title={t('docs.empty')} /> : <DocumentGrid d={d} />}
          {d.pageCount > 1 && (
            <Pagination aria-label={t('docs.title')}>
              <PaginationContent>
                {Array.from({ length: d.pageCount }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      isActive={i + 1 === d.page}
                      onClick={(e) => {
                        e.preventDefault();
                        d.setPage(i + 1);
                      }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
              </PaginationContent>
            </Pagination>
          )}
        </TabsContent>
      </Tabs>

      <DocumentDrawer d={d} />
      <UploadModal d={d} />
    </div>
  );
}
