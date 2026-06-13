import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Avatar,
  AvatarFallback,
  Badge,
} from '@dev-dga/react';
import { staff } from '@/data/fixtures';
import { tField, useLang, useT } from '@/i18n';
import { DEPT_KEY } from '../staff/staff-keys';

export function TeamPanel() {
  const t = useT();
  const lang = useLang();

  return (
    <Table aria-label={t('settings.team')}>
      <TableHeader>
        <TableRow>
          <TableHead>{t('queue.col.applicant')}</TableHead>
          <TableHead>{t('profile.role')}</TableHead>
          <TableHead>{t('profile.department')}</TableHead>
          <TableHead>{t('profile.email')}</TableHead>
          <TableHead>{t('common.status')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {staff.map((m) => (
          <TableRow key={m.id}>
            <TableCell>
              <span className="flex items-center gap-2">
                <Avatar size="sm">
                  <AvatarFallback>{m.initials}</AvatarFallback>
                </Avatar>
                {tField(m.name, lang)}
              </span>
            </TableCell>
            <TableCell>{tField(m.role, lang)}</TableCell>
            <TableCell>{t(DEPT_KEY[m.department])}</TableCell>
            <TableCell>{m.email}</TableCell>
            <TableCell>
              <Badge size="sm" variant={m.onShift ? 'success-subtle' : 'secondary'}>
                {m.onShift ? t('staffdir.onShift') : t('staffdir.offShift')}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
