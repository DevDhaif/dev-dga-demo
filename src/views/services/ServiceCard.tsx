import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Link,
  Rating,
} from '@dev-dga/react';
import type { Service } from '@/data/types';
import { tField, useLang, useT } from '@/i18n';
import { CategoryBanner } from './CategoryBanner';

export function ServiceCard({ service }: { service: Service }) {
  const t = useT();
  const lang = useLang();

  return (
    <Card data-testid="service-card" className="flex flex-col">
      <CategoryBanner category={service.category} ratio="16/9" />
      <CardHeader>
        <CardTitle asChild>
          <h2>{tField(service.name, lang)}</h2>
        </CardTitle>
        <CardDescription>{tField(service.summary, lang)}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-2">
        <span>
          {t('catalog.fee')}: {t('form.sar', { n: service.fee.toLocaleString('en-US') })}
        </span>
        <span className="flex flex-wrap items-center gap-2">
          <Rating value={service.rating} readOnly size="sm" />
          <span className="text-(--ddga-color-muted-foreground)">
            {t('catalog.ratings', { n: service.ratingsCount.toLocaleString('en-US') })}
          </span>
        </span>
      </CardContent>
      <CardFooter>
        <Link asChild>
          <RouterLink to={`/services/${service.slug}`}>{t('catalog.viewService')}</RouterLink>
        </Link>
      </CardFooter>
    </Card>
  );
}
