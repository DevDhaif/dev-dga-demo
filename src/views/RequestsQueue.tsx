import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  EmptyState,
  FloatingButton,
  Skeleton,
} from '@dev-dga/react';
import { Plus } from 'lucide-react';
import type { RequestStatus } from '@/data/types';
import { STATUS_KEY } from '@/data/labels';
import { useT } from '@/i18n';
import { useFakeLoading } from '@/app/use-fake-loading';
import { useQueue } from './queue/use-queue';
import type { StatusTab } from './queue/queue-state';
import { QueueToolbar } from './queue/QueueToolbar';
import { QueueTable } from './queue/QueueTable';
import { QueuePagination } from './queue/QueuePagination';
import { RejectModal } from './queue/RejectModal';

const TABS: StatusTab[] = ['all', 'new', 'in_review', 'approved', 'rejected', 'completed'];

export function RequestsQueue() {
  const t = useT();
  const q = useQueue();
  const loading = useFakeLoading();
  const [rejectOpen, setRejectOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0">{t('queue.title')}</h1>
        <Button variant="primary" asChild>
          <RouterLink to="/requests/new">{t('queue.newRequest')}</RouterLink>
        </Button>
      </header>

      <QueueToolbar q={q} />

      <Tabs
        value={q.ui.status}
        onValueChange={(v) => q.send({ type: 'setStatusTab', status: v as StatusTab })}
      >
        <TabsList>
          {TABS.map((s) => (
            <TabsTrigger key={s} value={s}>
              {s === 'all' ? t('common.all') : t(STATUS_KEY[s as RequestStatus])}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={q.ui.status} className="flex flex-col gap-4 pt-3">
          {q.ui.selected.length > 0 && (
            <div
              className="flex flex-wrap items-center gap-3 rounded-lg px-3 py-2 bg-(--ddga-color-muted)"
              data-testid="bulk-bar"
            >
              <span>{t('queue.bulk.selected', { count: q.ui.selected.length })}</span>
              <Button size="sm" onClick={() => q.approve(q.ui.selected)}>
                {t('queue.bulk.approve')}
              </Button>
              <Button size="sm" variant="destructive" onClick={() => setRejectOpen(true)}>
                {t('queue.bulk.reject')}
              </Button>
            </div>
          )}

          {loading ? (
            <Skeleton height={320} aria-label={t('common.loading')} />
          ) : q.total === 0 ? (
            <EmptyState title={t('queue.empty')} />
          ) : (
            <>
              <QueueTable q={q} />
              {q.pageCount > 1 && <QueuePagination q={q} />}
            </>
          )}
        </TabsContent>
      </Tabs>

      <RejectModal
        open={rejectOpen}
        count={q.ui.selected.length}
        onOpenChange={setRejectOpen}
        onConfirm={() => {
          q.reject(q.ui.selected);
          setRejectOpen(false);
        }}
      />

      <FloatingButton
        asChild
        icon={<Plus aria-hidden />}
        aria-label={t('queue.newRequest')}
        className="fixed bottom-6 end-6 z-20"
      >
        <RouterLink to="/requests/new" />
      </FloatingButton>
    </div>
  );
}
