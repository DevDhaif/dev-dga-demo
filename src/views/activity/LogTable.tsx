import {
  Tag,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@dev-dga/react';
import type { ActivityKind } from '@/data/types';
import { formatDateTime } from '@/data/labels';
import { tField, useLang, useT, type I18nKey } from '@/i18n';
import type { LogModule, LogRow } from './activity-log';
import type { LogView } from './log-view';

const KIND_LABEL: Record<ActivityKind, I18nKey> = {
  submitted: 'activity.kind.submitted',
  approved: 'activity.kind.approved',
  rejected: 'activity.kind.rejected',
  assigned: 'activity.kind.assigned',
  completed: 'activity.kind.completed',
  booked: 'activity.kind.booked',
  uploaded: 'activity.kind.uploaded',
  commented: 'activity.kind.commented',
};

const MODULE_LABEL: Record<LogModule, I18nKey> = {
  requests: 'nav.requests',
  appointments: 'nav.appointments',
  documents: 'nav.documents',
};

export function LogTable({ rows, total, view }: { rows: LogRow[]; total: number; view: LogView }) {
  const t = useT();
  const lang = useLang();
  const colCount = 3 + (view.cols.module ? 1 : 0) + (view.cols.ref ? 1 : 0);

  return (
    <Table size={view.density} aria-label={t('activity.title')} data-testid="activity-table">
      <TableCaption>{t('activity.caption')}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>{t('activity.colTime')}</TableHead>
          <TableHead>{t('activity.colEvent')}</TableHead>
          <TableHead>{t('activity.colSubject')}</TableHead>
          {view.cols.module && <TableHead>{t('activity.colModule')}</TableHead>}
          {view.cols.ref && <TableHead>{t('activity.colRef')}</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{formatDateTime(row.at)}</TableCell>
            <TableCell>
              <Tag size="sm" variant="secondary">
                {t(KIND_LABEL[row.kind])}
              </Tag>
            </TableCell>
            <TableCell>{tField(row.subject, lang)}</TableCell>
            {view.cols.module && <TableCell>{t(MODULE_LABEL[row.module])}</TableCell>}
            {view.cols.ref && <TableCell dir="ltr">{row.ref}</TableCell>}
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={colCount}>
            {total.toLocaleString('en-US')} {t('activity.events')}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
