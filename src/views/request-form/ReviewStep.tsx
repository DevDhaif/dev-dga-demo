import {
  DescriptionList,
  DescriptionItem,
  DescriptionTerm,
  DescriptionDetails,
} from '@dev-dga/react';
import { serviceById } from '@/data/fixtures';
import { CHANNEL_KEY, PRIORITY_KEY, formatDate } from '@/data/labels';
import { tField, useLang, useT } from '@/i18n';
import { DISTRICTS } from './form-state';
import type { RequestFormController } from './use-request-form';

export function ReviewStep({ f }: { f: RequestFormController }) {
  const t = useT();
  const lang = useLang();
  const d = f.draft;
  const service = d.serviceId ? serviceById(d.serviceId) : undefined;
  const district = DISTRICTS.find((x) => x.en === d.district);

  const rows: [string, string][] = [
    [t('form.applicant.name'), d.name || '-'],
    [t('form.applicant.nationalId'), d.nationalId || '-'],
    [t('form.details.service'), service ? tField(service.name, lang) : '-'],
    [t('form.details.district'), district ? tField(district, lang) : '-'],
    [t('form.details.channel'), d.channel ? t(CHANNEL_KEY[d.channel]) : '-'],
    [t('form.details.neededBy'), d.neededBy ? formatDate(d.neededBy.toISOString()) : '-'],
    [t('form.details.quantity'), String(d.quantity)],
    [t('form.details.priority'), t(PRIORITY_KEY[d.priority])],
    [t('form.details.tags'), d.tags.length ? d.tags.join(', ') : '-'],
    [t('form.docs.upload'), String(f.files.length + (f.existing?.attachments.length ?? 0))],
  ];
  if (service) {
    rows.push(
      [t('form.fee'), t('form.sar', { n: service.fee.toLocaleString('en-US') })],
      [t('form.sla'), t('form.days', { n: service.slaDays })],
    );
  }

  return (
    <div className="max-w-xl" data-testid="review-summary">
      <h2>{t('form.review.summary')}</h2>
      <DescriptionList divided>
        {rows.map(([term, details]) => (
          <DescriptionItem key={term}>
            <DescriptionTerm>{term}</DescriptionTerm>
            <DescriptionDetails>{details}</DescriptionDetails>
          </DescriptionItem>
        ))}
      </DescriptionList>
    </div>
  );
}
