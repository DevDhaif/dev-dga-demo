import { Link as RouterLink } from 'react-router-dom';
import {
  Tag,
  StatusTag,
  DescriptionDetails,
  DescriptionItem,
  DescriptionList,
  DescriptionTerm,
  Link,
} from '@dev-dga/react';
import { serviceById } from '@/data/fixtures';
import {
  formatDate,
  formatDateTime,
  CHANNEL_KEY,
  PRIORITY_BADGE,
  PRIORITY_KEY,
  STATUS_KEY,
  STATUS_TONE,
} from '@/data/labels';
import type { ServiceRequest } from '@/data/types';
import { tField, useLang, useT } from '@/i18n';

export function InfoPanel({ request }: { request: ServiceRequest }) {
  const t = useT();
  const lang = useLang();
  const service = serviceById(request.serviceId);

  return (
    <DescriptionList divided data-testid="request-info">
      <DescriptionItem>
        <DescriptionTerm>{t('common.status')}</DescriptionTerm>
        <DescriptionDetails>
          <StatusTag tone={STATUS_TONE[request.status]}>{t(STATUS_KEY[request.status])}</StatusTag>
        </DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem>
        <DescriptionTerm>{t('detail.applicant')}</DescriptionTerm>
        <DescriptionDetails>{tField(request.applicant.name, lang)}</DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem>
        <DescriptionTerm>{t('detail.nationalId')}</DescriptionTerm>
        <DescriptionDetails dir="ltr">{request.applicant.nationalId}</DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem>
        <DescriptionTerm>{t('detail.phone')}</DescriptionTerm>
        <DescriptionDetails dir="ltr">{request.applicant.phone}</DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem>
        <DescriptionTerm>{t('detail.service')}</DescriptionTerm>
        <DescriptionDetails>
          {service ? (
            <Link asChild>
              <RouterLink to={`/services/${service.slug}`}>{tField(service.name, lang)}</RouterLink>
            </Link>
          ) : (
            '-'
          )}
        </DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem>
        <DescriptionTerm>{t('detail.district')}</DescriptionTerm>
        <DescriptionDetails>{tField(request.district, lang)}</DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem>
        <DescriptionTerm>{t('detail.channel')}</DescriptionTerm>
        <DescriptionDetails>{t(CHANNEL_KEY[request.channel])}</DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem>
        <DescriptionTerm>{t('detail.priority')}</DescriptionTerm>
        <DescriptionDetails>
          <Tag size="sm" variant={PRIORITY_BADGE[request.priority]}>
            {t(PRIORITY_KEY[request.priority])}
          </Tag>
        </DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem>
        <DescriptionTerm>{t('detail.submitted')}</DescriptionTerm>
        <DescriptionDetails>{formatDateTime(request.submittedAt)}</DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem>
        <DescriptionTerm>{t('detail.neededBy')}</DescriptionTerm>
        <DescriptionDetails>
          {request.neededBy ? formatDate(request.neededBy) : '-'}
        </DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem>
        <DescriptionTerm>{t('detail.attachments')}</DescriptionTerm>
        <DescriptionDetails>
          {request.attachments.length.toLocaleString('en-US')}
        </DescriptionDetails>
      </DescriptionItem>
    </DescriptionList>
  );
}
