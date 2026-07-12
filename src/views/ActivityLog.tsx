import { useState } from 'react';
import { EmptyState } from '@dev-dga/react';
import { paginate } from '@/store/paging';
import { useStore } from '@/store/store-context';
import { useT } from '@/i18n';
import { buildLog, filterByModule } from './activity/activity-log';
import { LogPagination } from './activity/LogPagination';
import { LogTable } from './activity/LogTable';
import { LogToolbar } from './activity/LogToolbar';
import { initialLogView, type LogView } from './activity/log-view';

const PAGE_SIZE = 9;

export function ActivityLog() {
  const t = useT();
  const { state } = useStore();
  const [view, setView] = useState<LogView>(initialLogView);
  const [page, setPage] = useState(1);

  const filtered = filterByModule(buildLog(state), view.module);
  const { rows, total, pageCount } = paginate(filtered, page, PAGE_SIZE);

  const onViewChange = (patch: Partial<LogView>) => {
    setView((v) => ({ ...v, ...patch }));
    if (patch.module) setPage(1);
  };

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="m-0">{t('activity.title')}</h1>
      </header>

      <LogToolbar view={view} onChange={onViewChange} />

      {total === 0 ? (
        <EmptyState title={t('activity.empty')} description={t('activity.emptyDesc')} />
      ) : (
        <>
          <LogTable rows={rows} total={total} view={view} />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-(--ddga-color-muted-foreground)">
              {t('activity.pageSummary', {
                from: ((Math.min(page, pageCount) - 1) * PAGE_SIZE + 1).toLocaleString('en-US'),
                to: Math.min(Math.min(page, pageCount) * PAGE_SIZE, total).toLocaleString('en-US'),
                total: total.toLocaleString('en-US'),
              })}
            </span>
            <LogPagination
              page={Math.min(page, pageCount)}
              pageCount={pageCount}
              onPage={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
}
