import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  paginationRange,
} from '@dev-dga/react';
import { useT } from '@/i18n';

export function LogPagination({
  page,
  pageCount,
  onPage,
}: {
  page: number;
  pageCount: number;
  onPage: (p: number) => void;
}) {
  const t = useT();
  const go = (p: number) => onPage(Math.min(Math.max(1, p), pageCount));

  return (
    <Pagination aria-label={t('activity.title')}>
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
        {paginationRange(page, pageCount).map((entry, i) =>
          entry === 'ellipsis' ? (
            <PaginationItem key={`gap-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={entry}>
              <PaginationLink
                href="#"
                isActive={entry === page}
                onClick={(e) => {
                  e.preventDefault();
                  go(entry);
                }}
              >
                {entry.toLocaleString('en-US')}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
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
