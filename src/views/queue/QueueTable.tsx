import { Table, TableHeader, TableBody, TableRow, TableHead, Checkbox } from '@dev-dga/react';
import { useT } from '@/i18n';
import type { SortColumn } from './queue-state';
import type { QueueController } from './use-queue';
import { QueueRow } from './QueueRow';

export function QueueTable({ q }: { q: QueueController }) {
  const t = useT();
  const sortDirOf = (col: SortColumn): 'asc' | 'desc' | false =>
    q.ui.sortBy === col ? q.ui.sortDir : false;
  const sortable = (col: SortColumn, label: string) => ({
    sortable: true,
    sortDirection: sortDirOf(col),
    onClick: () => q.send({ type: 'toggleSort', column: col }),
    sortLabel: t('queue.sort'),
    children: label,
  });

  return (
    <Table aria-label={t('queue.tableLabel')}>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Checkbox
              checked={q.headerChecked}
              onCheckedChange={() => q.send({ type: 'toggleAllOnPage', pageIds: q.pageIds })}
              aria-label={t('common.all')}
            />
          </TableHead>
          <TableHead>{t('queue.col.id')}</TableHead>
          <TableHead>{t('queue.col.applicant')}</TableHead>
          <TableHead>{t('queue.col.service')}</TableHead>
          <TableHead>{t('queue.col.district')}</TableHead>
          <TableHead {...sortable('priority', t('queue.col.priority'))} />
          <TableHead {...sortable('submittedAt', t('queue.col.submitted'))} />
          <TableHead>{t('queue.col.assignee')}</TableHead>
          <TableHead {...sortable('status', t('common.status'))} />
          <TableHead align="end">{t('common.actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {q.rows.map((r) => (
          <QueueRow key={r.id} r={r} q={q} />
        ))}
      </TableBody>
    </Table>
  );
}
