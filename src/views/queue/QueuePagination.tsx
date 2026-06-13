import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@dev-dga/react';
import { useT } from '@/i18n';
import type { QueueController } from './use-queue';

export function QueuePagination({ q }: { q: QueueController }) {
  const t = useT();
  const page = Math.min(q.ui.page, q.pageCount);
  const go = (p: number) =>
    q.send({ type: 'setPage', page: Math.min(Math.max(1, p), q.pageCount) });

  return (
    <Pagination aria-label={t('queue.title')}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            label={t('form.back')}
            onClick={(e) => {
              e.preventDefault();
              go(page - 1);
            }}
          />
        </PaginationItem>
        {Array.from({ length: q.pageCount }).map((_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={i + 1 === page}
              onClick={(e) => {
                e.preventDefault();
                go(i + 1);
              }}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href="#"
            label={t('form.next')}
            onClick={(e) => {
              e.preventDefault();
              go(page + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
