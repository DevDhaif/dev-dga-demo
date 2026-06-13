import {
  Card,
  CardContent,
  CardHeader,
  CardIcon,
  CardTitle,
  Timeline,
  TimelineContent,
  TimelineItem,
  TimelineMarker,
  TimelineTime,
  TimelineTitle,
} from '@dev-dga/react';
import { Activity } from 'lucide-react';
import { tField, useLang, useT } from '@/i18n';
import { formatDateTime } from '@/data/labels';
import { recentActivity } from '@/store/selectors';
import { useStore } from '@/store/store-context';
import { markerStatus } from './overview-logic';

export function ActivityCard({ className }: { className?: string }) {
  const t = useT();
  const lang = useLang();
  const { state } = useStore();
  return (
    <Card className={className} data-testid="recent-activity">
      <CardHeader>
        <CardIcon>
          <Activity />
        </CardIcon>
        <CardTitle asChild>
          <h2>{t('overview.activity')}</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Timeline size="sm">
          {recentActivity(state, 8).map((event) => (
            <TimelineItem key={event.id}>
              <TimelineMarker status={markerStatus(event.kind)} />
              <TimelineContent>
                <TimelineTitle>{tField(event.text, lang)}</TimelineTitle>
                <TimelineTime dateTime={event.at}>{formatDateTime(event.at)}</TimelineTime>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
}
