import { useState } from 'react';
import {
  StructuredList,
  StructuredListHeader,
  StructuredListBody,
  StructuredListRow,
  StructuredListHead,
  StructuredListCell,
  Avatar,
  AvatarFallback,
  Tag,
} from '@dev-dga/react';
import { staff } from '@/data/fixtures';
import { tField, useLang, useT } from '@/i18n';
import { DEPT_KEY } from '../staff/staff-keys';

export function TeamPanel() {
  const t = useT();
  const lang = useLang();
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <section aria-label={t('settings.team')}>
      <StructuredList selectable rowDivider>
        <StructuredListHeader>
          <StructuredListRow>
            <StructuredListHead>{t('queue.col.applicant')}</StructuredListHead>
            <StructuredListHead>{t('profile.role')}</StructuredListHead>
            <StructuredListHead>{t('profile.department')}</StructuredListHead>
            <StructuredListHead>{t('profile.email')}</StructuredListHead>
            <StructuredListHead>{t('common.status')}</StructuredListHead>
          </StructuredListRow>
        </StructuredListHeader>
        <StructuredListBody>
          {staff.map((m) => (
            <StructuredListRow
              key={m.id}
              selected={selected.includes(m.id)}
              onSelectedChange={() => toggle(m.id)}
              selectionLabel={tField(m.name, lang)}
            >
              <StructuredListCell>
                <span className="flex items-center gap-2">
                  <Avatar size="sm">
                    <AvatarFallback>{m.initials}</AvatarFallback>
                  </Avatar>
                  {tField(m.name, lang)}
                </span>
              </StructuredListCell>
              <StructuredListCell>{tField(m.role, lang)}</StructuredListCell>
              <StructuredListCell>{t(DEPT_KEY[m.department])}</StructuredListCell>
              <StructuredListCell>{m.email}</StructuredListCell>
              <StructuredListCell>
                <Tag size="sm" variant={m.onShift ? 'success-subtle' : 'secondary'}>
                  {m.onShift ? t('staffdir.onShift') : t('staffdir.offShift')}
                </Tag>
              </StructuredListCell>
            </StructuredListRow>
          ))}
        </StructuredListBody>
      </StructuredList>
    </section>
  );
}
