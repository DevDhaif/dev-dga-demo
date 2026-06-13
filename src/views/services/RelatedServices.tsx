import { Link as RouterLink } from 'react-router-dom';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle, Link } from '@dev-dga/react';
import type { Service } from '@/data/types';
import { tField, useLang, useT } from '@/i18n';

export function RelatedServices({ items }: { items: Service[] }) {
  const t = useT();
  const lang = useLang();

  return (
    <section className="flex flex-col gap-3" data-testid="related-services">
      <h2 className="m-0">{t('service.related')}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {items.map((s) => (
          <Card key={s.id} className="flex flex-col">
            <CardHeader className="flex-1">
              <CardTitle>{tField(s.name, lang)}</CardTitle>
              <CardDescription>{tField(s.summary, lang)}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link asChild>
                <RouterLink to={`/services/${s.slug}`}>{t('catalog.viewService')}</RouterLink>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
