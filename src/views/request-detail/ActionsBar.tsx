import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@dev-dga/react';
import { staff } from '@/data/fixtures';
import { tField, useLang, useT } from '@/i18n';
import { RejectModal } from '../queue/RejectModal';
import type { RequestDetailController } from './use-request-detail';

export function ActionsBar({ c }: { c: RequestDetailController }) {
  const t = useT();
  const lang = useLang();
  const [rejectOpen, setRejectOpen] = useState(false);
  const request = c.request!;
  const closed = request.status === 'approved' || request.status === 'completed';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="primary" size="sm" disabled={closed} onClick={c.approve}>
        {t('queue.actions.approve')}
      </Button>
      <Button
        variant="destructive-outline"
        size="sm"
        disabled={request.status === 'rejected'}
        onClick={() => setRejectOpen(true)}
      >
        {t('queue.actions.reject')}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            {t('detail.assign')}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>{t('detail.assignTo')}</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={request.assigneeId ?? ''}
              onValueChange={(v) => c.assign(v)}
            >
              {staff.map((m) => (
                <DropdownMenuRadioItem key={m.id} value={m.id}>
                  {tField(m.name, lang)}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="ghost" size="sm" asChild>
        <RouterLink to={`/requests/${request.id}/edit`}>{t('detail.edit')}</RouterLink>
      </Button>

      <RejectModal
        open={rejectOpen}
        count={1}
        onOpenChange={setRejectOpen}
        onConfirm={() => {
          c.reject();
          setRejectOpen(false);
        }}
      />
    </div>
  );
}
