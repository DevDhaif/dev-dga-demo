import { Rating, SaudiRiyal } from '@dev-dga/react';
import type { Service } from '@/data/types';
import { useT } from '@/i18n';

const MUTED = { color: 'var(--ddga-color-muted-foreground)' } as const;

export function ServiceFacts({ service }: { service: Service }) {
  const t = useT();

  return (
    <div className="flex flex-wrap items-start gap-x-10 gap-y-3" data-testid="service-facts">
      <div className="flex flex-col gap-1">
        <span style={MUTED}>{t('service.fee')}</span>
        <SaudiRiyal className="font-semibold" value={service.fee} />
      </div>
      <div className="flex flex-col gap-1">
        <span style={MUTED}>{t('service.sla')}</span>
        <span className="font-semibold">
          {t('form.days', { n: service.slaDays.toLocaleString('en-US') })}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span style={MUTED}>{t('service.rating')}</span>
        <Rating value={service.rating} readOnly size="sm" />
      </div>
    </div>
  );
}
