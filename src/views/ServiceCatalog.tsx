import { useState } from 'react';
import { Combobox, ComboboxItem, EmptyState, SearchBox } from '@dev-dga/react';
import { services } from '@/data/fixtures';
import { CATEGORY_KEY } from '@/data/labels';
import type { ServiceCategory } from '@/data/types';
import { useLang, useT } from '@/i18n';
import { filterServices, type CategoryFilter } from './services/catalog-logic';
import { ServiceCard } from './services/ServiceCard';

const CATEGORIES = Object.keys(CATEGORY_KEY) as ServiceCategory[];

export function ServiceCatalog() {
  const t = useT();
  const lang = useLang();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const visible = filterServices(services, query, lang, category);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="m-0">{t('catalog.title')}</h1>

      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-48 flex-1">
          <SearchBox
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('catalog.searchPlaceholder')}
            aria-label={t('catalog.searchPlaceholder')}
          />
        </div>
        <Combobox
          label={t('catalog.category')}
          value={category}
          onValueChange={(v) => setCategory(v as CategoryFilter)}
        >
          <ComboboxItem value="all">{t('common.all')}</ComboboxItem>
          {CATEGORIES.map((c) => (
            <ComboboxItem key={c} value={c}>
              {t(CATEGORY_KEY[c])}
            </ComboboxItem>
          ))}
        </Combobox>
      </div>

      {visible.length === 0 ? (
        <EmptyState variant="search" title={t('catalog.empty')} />
      ) : (
        <div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          data-testid="catalog-grid"
        >
          {visible.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      )}
    </div>
  );
}
