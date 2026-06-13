import { Link as RouterLink } from 'react-router-dom';
import {
  Badge,
  EmptyState,
  Link,
  List,
  ListItem,
  ListItemContent,
  ListItemAction,
} from '@dev-dga/react';
import type { ServiceRequest } from '@/data/types';
import { serviceById } from '@/data/fixtures';
import { STATUS_BADGE, STATUS_KEY, formatDate } from '@/data/labels';
import { tField, useLang, useT } from '@/i18n';

export function AssignmentsList({ assignments }: { assignments: ServiceRequest[] }) {
  const t = useT();
  const lang = useLang();

  if (assignments.length === 0) return <EmptyState title={t('profile.assignments.empty')} />;

  return (
    <List variant="plain" divided data-testid="assignments-list">
      {assignments.map((r) => (
        <ListItem key={r.id}>
          <ListItemContent
            primary={
              <Link asChild>
                <RouterLink to={`/requests/${r.id}`}>
                  {r.id} , {tField(r.applicant.name, lang)}
                </RouterLink>
              </Link>
            }
            secondary={`${tField(
              serviceById(r.serviceId)?.name ?? { en: r.serviceId, ar: r.serviceId },
              lang,
            )} · ${formatDate(r.submittedAt)}`}
          />
          <ListItemAction>
            <Badge size="sm" variant={STATUS_BADGE[r.status]}>
              {t(STATUS_KEY[r.status])}
            </Badge>
          </ListItemAction>
        </ListItem>
      ))}
    </List>
  );
}
