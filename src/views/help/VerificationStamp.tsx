import { DigitalStamp } from '@dev-dga/react';
import { useT } from '@/i18n';

export function VerificationStamp() {
  const t = useT();
  return (
    <DigitalStamp
      aria-label={t('help.verify.aria')}
      statement={t('help.verify.statement')}
      triggerLabel={t('help.verify.trigger')}
      registrationLabel={t('help.verify.regLabel')}
      registrationNumber="DGA-MSR-2026-0001"
    />
  );
}
