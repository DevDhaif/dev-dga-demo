import { useState } from 'react';
import {
  Combobox,
  ComboboxItem,
  EmptyState,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  SearchBox,
  Stat,
  Toggle,
} from '@dev-dga/react';
import { staff } from '@/data/fixtures';
import type { Department } from '@/data/types';
import { useLang, useT } from '@/i18n';
import { filterStaff } from './staff/staff-logic';
import { DEPT_KEY } from './staff/staff-keys';
import { StaffCard } from './staff/StaffCard';

const DEPARTMENTS = Object.keys(DEPT_KEY) as Department[];
const PAGE_SIZE = 6;

export function StaffDirectory() {
  const t = useT();
  const lang = useLang();
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState<Department | 'all'>('all');
  const [showOffShift, setShowOffShift] = useState(true);
  const [page, setPage] = useState(1);

  const { rows, total, pageCount } = filterStaff(staff, {
    query,
    lang,
    department,
    showOffShift,
    page,
    pageSize: PAGE_SIZE,
  });

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0">{t('staffdir.title')}</h1>
        <Stat label={t('staffdir.headcount')} value={total.toLocaleString('en-US')} />
      </header>

      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-48 flex-1">
          <SearchBox
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder={t('staffdir.searchPlaceholder')}
            aria-label={t('topbar.search')}
          />
        </div>
        <Combobox
          label={t('staffdir.department')}
          value={department}
          onValueChange={(v) => {
            setDepartment(v as Department | 'all');
            setPage(1);
          }}
        >
          <ComboboxItem value="all">{t('common.all')}</ComboboxItem>
          {DEPARTMENTS.map((d) => (
            <ComboboxItem key={d} value={d}>
              {t(DEPT_KEY[d])}
            </ComboboxItem>
          ))}
        </Combobox>
        <Toggle
          pressed={showOffShift}
          onPressedChange={(p) => {
            setShowOffShift(p);
            setPage(1);
          }}
        >
          {t('staffdir.showOff')}
        </Toggle>
      </div>

      {total === 0 ? (
        <EmptyState title={t('staffdir.empty')} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" data-testid="staff-grid">
          {rows.map((m) => (
            <StaffCard key={m.id} m={m} />
          ))}
        </div>
      )}

      {pageCount > 1 && (
        <Pagination aria-label={t('staffdir.title')}>
          <PaginationContent>
            {Array.from({ length: pageCount }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={i + 1 === page}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
