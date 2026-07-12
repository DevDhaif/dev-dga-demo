import { SearchBox, Dropdown, DropdownItem, Select, SelectItem } from '@dev-dga/react';
import { services } from '@/data/fixtures';
import { tField, useLang, useT } from '@/i18n';
import type { QueueController } from './use-queue';

export function QueueToolbar({ q }: { q: QueueController }) {
  const t = useT();
  const lang = useLang();

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="min-w-48 flex-1">
        <SearchBox
          voiceSearch={false}
          value={q.ui.query}
          onChange={(e) => q.send({ type: 'setQuery', query: e.target.value })}
          placeholder={t('queue.searchPlaceholder')}
          aria-label={t('topbar.search')}
        />
      </div>
      <Dropdown
        label={t('queue.filter.service')}
        value={q.ui.serviceId}
        onValueChange={(v) => q.send({ type: 'setService', serviceId: v })}
      >
        <DropdownItem value="all">{t('common.all')}</DropdownItem>
        {services.map((s) => (
          <DropdownItem key={s.id} value={s.id} keywords={[s.name.en, s.name.ar]}>
            {tField(s.name, lang)}
          </DropdownItem>
        ))}
      </Dropdown>
      <Select
        label={t('queue.pageSize')}
        value={String(q.ui.pageSize)}
        onValueChange={(v) => q.send({ type: 'setPageSize', pageSize: Number(v) })}
      >
        <SelectItem value="10">10</SelectItem>
        <SelectItem value="20">20</SelectItem>
      </Select>
    </div>
  );
}
