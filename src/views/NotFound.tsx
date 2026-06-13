import { Link as RouterLink } from 'react-router-dom';
import {
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateMedia,
  EmptyStateTitle,
} from '@dev-dga/react';
import { Compass } from 'lucide-react';
import { useT } from '@/i18n';

export function NotFound() {
  const t = useT();
  return (
    <EmptyState data-testid="not-found">
      <EmptyStateMedia>
        <Compass aria-hidden />
      </EmptyStateMedia>
      <EmptyStateTitle>{t('notFound.title')}</EmptyStateTitle>
      <EmptyStateDescription>{t('notFound.desc')}</EmptyStateDescription>
      <EmptyStateActions>
        <Button asChild>
          <RouterLink to="/">{t('notFound.back')}</RouterLink>
        </Button>
      </EmptyStateActions>
    </EmptyState>
  );
}
