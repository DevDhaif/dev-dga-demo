import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Divider,
  EmptyState,
  Link,
} from '@dev-dga/react';
import { serviceBySlug, services } from '@/data/fixtures';
import { tField, useLang, useT } from '@/i18n';
import { relatedServices } from './services/catalog-logic';
import { CategoryBanner } from './services/CategoryBanner';
import { ServiceFacts } from './services/ServiceFacts';
import { ServiceFaq } from './services/ServiceFaq';
import { ServiceSteps } from './services/ServiceSteps';
import { ServiceTestimonial } from './services/ServiceTestimonial';
import { RelatedServices } from './services/RelatedServices';

export function ServicePage() {
  const { slug } = useParams();
  const t = useT();
  const lang = useLang();
  const service = slug ? serviceBySlug(slug) : undefined;

  if (!service) {
    return (
      <EmptyState
        variant="error"
        title={t('service.notFound')}
        action={
          <Link asChild>
            <RouterLink to="/services">{t('catalog.title')}</RouterLink>
          </Link>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <RouterLink to="/services">{t('catalog.title')}</RouterLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{tField(service.name, lang)}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <CategoryBanner category={service.category} ratio="21/9">
        <h1 className="m-0" data-testid="service-title">
          {tField(service.name, lang)}
        </h1>
      </CategoryBanner>

      <div className="flex max-w-prose flex-col gap-3">
        <p className="m-0 font-semibold">{tField(service.summary, lang)}</p>
        <p className="m-0 text-(--ddga-color-muted-foreground)">
          {tField(service.description, lang)}
        </p>
      </div>

      <ServiceFacts service={service} />
      <Divider />

      <section className="flex flex-col gap-3">
        <h2 className="m-0">{t('service.howToApply')}</h2>
        <ServiceSteps service={service} />
      </section>
      <Divider />

      <section className="flex flex-col gap-3">
        <h2 className="m-0">{t('service.faq')}</h2>
        <ServiceFaq service={service} />
      </section>
      <Divider />

      <ServiceTestimonial />

      <RelatedServices items={relatedServices(services, service)} />

      <div>
        <Button variant="primary" asChild>
          <RouterLink to="/requests/new">{t('service.startRequest')}</RouterLink>
        </Button>
      </div>
    </div>
  );
}
