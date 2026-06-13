import { useRouteError } from 'react-router-dom';
import {
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateTitle,
} from '@dev-dga/react';
import { useT } from '@/i18n';

export function RouteError() {
  const t = useT();
  const error = useRouteError();
  if (import.meta.env.DEV) console.error(error);
  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <EmptyState>
        <EmptyStateTitle>{t('error.title')}</EmptyStateTitle>
        <EmptyStateDescription>{t('error.desc')}</EmptyStateDescription>
        <EmptyStateActions>
          <Button onClick={() => window.location.reload()}>{t('error.reload')}</Button>
        </EmptyStateActions>
      </EmptyState>
    </main>
  );
}
