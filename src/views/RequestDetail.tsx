import { Link as RouterLink } from 'react-router-dom';
import {
  Tag,
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateTitle,
} from '@dev-dga/react';
import { STATUS_BADGE, STATUS_KEY } from '@/data/labels';
import { useT } from '@/i18n';
import { ActionsBar } from './request-detail/ActionsBar';
import { CommentsCard } from './request-detail/CommentsCard';
import { InfoPanel } from './request-detail/InfoPanel';
import { useRequestDetail } from './request-detail/use-request-detail';

export function RequestDetail() {
  const t = useT();
  const c = useRequestDetail();

  if (!c.request) {
    return (
      <EmptyState data-testid="request-missing">
        <EmptyStateTitle>{t('detail.notFound')}</EmptyStateTitle>
        <EmptyStateDescription>{t('detail.notFoundDesc')}</EmptyStateDescription>
        <EmptyStateActions>
          <Button asChild>
            <RouterLink to="/requests">{t('detail.backToQueue')}</RouterLink>
          </Button>
        </EmptyStateActions>
      </EmptyState>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0 flex items-center gap-3">
          <span dir="ltr">{c.request.id}</span>
          <Tag variant={STATUS_BADGE[c.request.status]}>{t(STATUS_KEY[c.request.status])}</Tag>
        </h1>
        <ActionsBar c={c} />
      </header>

      <div className="grid items-start gap-4 lg:grid-cols-2">
        <InfoPanel request={c.request} />
        <CommentsCard c={c} />
      </div>
    </div>
  );
}
