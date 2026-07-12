import { Link as RouterLink } from 'react-router-dom';
import { Avatar, AvatarFallback, Tag, Card, CardContent, Rating, Link } from '@dev-dga/react';
import type { StaffMember } from '@/data/types';
import { DEPT_KEY } from './staff-keys';
import { tField, useLang, useT } from '@/i18n';

export function StaffCard({ m }: { m: StaffMember }) {
  const t = useT();
  const lang = useLang();

  return (
    <Card variant="outline" data-testid="staff-card">
      <CardContent className="flex flex-col gap-2 p-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{m.initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <Link asChild>
              <RouterLink to={`/staff/${m.id}`}>{tField(m.name, lang)}</RouterLink>
            </Link>
            <p className="m-0 truncate text-(--ddga-color-muted-foreground)">
              {tField(m.role, lang)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Tag size="sm" variant="secondary-subtle">
            {t(DEPT_KEY[m.department])}
          </Tag>
          <Tag size="sm" variant={m.onShift ? 'success-subtle' : 'secondary'}>
            {m.onShift ? t('staffdir.onShift') : t('staffdir.offShift')}
          </Tag>
        </div>
        <div className="flex items-center gap-2">
          <Rating
            value={Math.round(m.rating * 2) / 2}
            allowHalf
            readOnly
            aria-label={t('profile.kpi.rating')}
          />
          <span>{m.rating.toFixed(1)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
