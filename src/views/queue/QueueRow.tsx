import { useNavigate } from 'react-router-dom';
import {
  TableRow,
  TableCell,
  Checkbox,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@dev-dga/react';
import { MoreHorizontal } from 'lucide-react';
import type { ServiceRequest } from '@/data/types';
import { serviceById, staffById, staff } from '@/data/fixtures';
import { STATUS_BADGE, STATUS_KEY, PRIORITY_BADGE, PRIORITY_KEY, formatDate } from '@/data/labels';
import { tField, useLang, useT } from '@/i18n';
import type { QueueController } from './use-queue';

const ON_SHIFT = staff.filter((m) => m.onShift);

export function QueueRow({ r, q }: { r: ServiceRequest; q: QueueController }) {
  const t = useT();
  const lang = useLang();
  const navigate = useNavigate();
  const service = serviceById(r.serviceId);
  const assignee = r.assigneeId ? staffById(r.assigneeId) : undefined;

  return (
    <TableRow selected={q.ui.selected.includes(r.id)}>
      <TableCell>
        <Checkbox
          checked={q.ui.selected.includes(r.id)}
          onCheckedChange={() => q.send({ type: 'toggleRow', id: r.id })}
          aria-label={r.id}
        />
      </TableCell>
      <TableCell>{r.id}</TableCell>
      <TableCell>{tField(r.applicant.name, lang)}</TableCell>
      <TableCell>{service ? tField(service.name, lang) : r.serviceId}</TableCell>
      <TableCell>{tField(r.district, lang)}</TableCell>
      <TableCell>
        <Badge size="sm" variant={PRIORITY_BADGE[r.priority]}>
          {t(PRIORITY_KEY[r.priority])}
        </Badge>
      </TableCell>
      <TableCell>{formatDate(r.submittedAt)}</TableCell>
      <TableCell>{assignee ? tField(assignee.name, lang) : t('queue.unassigned')}</TableCell>
      <TableCell>
        <Badge size="sm" variant={STATUS_BADGE[r.status]}>
          {t(STATUS_KEY[r.status])}
        </Badge>
      </TableCell>
      <TableCell align="end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label={`${t('common.actions')} ${r.id}`}>
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => navigate(`/requests/${r.id}`)}>
              {t('common.view')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => q.approve([r.id])}>
              {t('queue.actions.approve')}
            </DropdownMenuItem>
            <DropdownMenuItem destructive onSelect={() => q.reject([r.id])}>
              {t('queue.actions.reject')}
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>{t('queue.actions.assign')}</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {ON_SHIFT.map((m) => (
                  <DropdownMenuItem key={m.id} onSelect={() => q.assign([r.id], m.id)}>
                    {tField(m.name, lang)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
