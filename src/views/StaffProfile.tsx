import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  AvatarFallback,
  Tag,
  EmptyState,
  Link,
  Quote,
  Rating,
  MetricGroup,
  Metric,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@dev-dga/react';
import { staffById } from '@/data/fixtures';
import { useStore } from '@/store/store-context';
import { staffWorkload } from '@/store/selectors';
import { tField, useLang, useT } from '@/i18n';
import { DEPT_KEY } from './staff/staff-keys';
import { AssignmentsList } from './staff/AssignmentsList';
import { AboutPanel } from './staff/AboutPanel';

export function StaffProfile() {
  const t = useT();
  const lang = useLang();
  const { id } = useParams();
  const { state } = useStore();
  const member = id ? staffById(id) : undefined;

  if (!member) {
    return (
      <EmptyState
        title={t('profile.notFound')}
        action={
          <Link asChild>
            <RouterLink to="/staff">{t('staffdir.title')}</RouterLink>
          </Link>
        }
      />
    );
  }

  const workload = staffWorkload(state.requests, member.id);
  const assignments = state.requests.filter((r) => r.assigneeId === member.id);

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-center gap-4">
        <Avatar size="lg">
          <AvatarFallback>{member.initials}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="m-0">{tField(member.name, lang)}</h1>
          <p className="m-0 text-(--ddga-color-muted-foreground)">
            {tField(member.role, lang)} · {t(DEPT_KEY[member.department])}
          </p>
        </div>
        <Tag variant={member.onShift ? 'success-subtle' : 'secondary'}>
          {member.onShift ? t('staffdir.onShift') : t('staffdir.offShift')}
        </Tag>
      </header>

      <MetricGroup columns={3} data-testid="profile-stats">
        <Metric label={t('profile.kpi.open')} value={workload.open.toLocaleString('en-US')} />
        <Metric label={t('profile.kpi.resolved')} value={member.resolved.toLocaleString('en-US')} />
        <Metric label={t('profile.kpi.rating')} value={member.rating.toFixed(1)} />
      </MetricGroup>

      <div className="flex items-center gap-2">
        <Rating
          value={Math.round(member.rating * 2) / 2}
          allowHalf
          readOnly
          aria-label={t('profile.kpi.rating')}
        />
        <span>{member.rating.toFixed(1)}</span>
      </div>

      <Quote author={tField(member.name, lang)}>{tField(member.quote, lang)}</Quote>

      <Tabs defaultValue="assignments">
        <TabsList>
          <TabsTrigger value="assignments">{t('profile.tab.assignments')}</TabsTrigger>
          <TabsTrigger value="about">{t('profile.tab.about')}</TabsTrigger>
        </TabsList>
        <TabsContent value="assignments" className="pt-3">
          <AssignmentsList assignments={assignments} />
        </TabsContent>
        <TabsContent value="about" className="pt-3">
          <AboutPanel member={member} workload={workload} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
