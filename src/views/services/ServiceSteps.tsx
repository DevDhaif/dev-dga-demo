import { Step, StepIndicator, Steps, StepTitle } from '@dev-dga/react';
import type { Service } from '@/data/types';
import { tField, useLang } from '@/i18n';

export function ServiceSteps({ service }: { service: Service }) {
  const lang = useLang();

  return (
    <Steps orientation="vertical" data-testid="service-steps">
      {service.steps.map((step, i) => (
        <Step key={i} state="upcoming">
          <StepIndicator step={i + 1} />
          <StepTitle>{tField(step, lang)}</StepTitle>
        </Step>
      ))}
    </Steps>
  );
}
