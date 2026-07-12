import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardIcon,
  CardTitle,
  Link,
  Tag,
  type DateRange,
} from '@dev-dga/react';
import { Inbox } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { RowList, RowItem } from '@/components/RowList';
import { tField, useLang, useT } from '@/i18n';
import { STATUS_BADGE, STATUS_KEY, formatDate } from '@/data/labels';
import { serviceById } from '@/data/fixtures';
import { pendingRequests } from '@/store/selectors';
import { useStore } from '@/store/store-context';
import { withinRange } from './overview-logic';

const MAX_ROWS = 8;

export function PendingRequestsCard({
  range,
  className,
}: {
  range: DateRange | null;
  className?: string;
}) {
  const t = useT();
  const lang = useLang();
  const { state } = useStore();
  const rows = pendingRequests(state, state.requests.length)
    .filter((r) => withinRange(r.submittedAt, range))
    .slice(0, MAX_ROWS);
  return (
    <Card className={className} data-testid="pending-requests">
      <CardHeader>
        <CardIcon>
          <Inbox />
        </CardIcon>
        <CardTitle asChild>
          <h2>{t('overview.pending')}</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RowList divided>
          {rows.map((r) => {
            const service = serviceById(r.serviceId);
            return (
              <RowItem
                key={r.id}
                primary={
                  <Link asChild>
                    <RouterLink to={`/requests/${r.id}`}>
                      {r.id} , {tField(r.applicant.name, lang)}
                    </RouterLink>
                  </Link>
                }
                secondary={`${service ? tField(service.name, lang) : r.serviceId} · ${formatDate(r.submittedAt)}`}
                trailing={<Tag variant={STATUS_BADGE[r.status]}>{t(STATUS_KEY[r.status])}</Tag>}
              />
            );
          })}
        </RowList>
      </CardContent>
      <CardFooter>
        <Button variant="outline" asChild>
          <RouterLink to="/requests">{t('overview.viewAll')}</RouterLink>
        </Button>
      </CardFooter>
    </Card>
  );
}
