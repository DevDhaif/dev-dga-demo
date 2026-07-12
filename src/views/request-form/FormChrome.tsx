import { useNavigate } from 'react-router-dom';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  ProgressIndicator,
  Step,
  StepContent,
  StepDescription,
  StepIndicator,
  StepTitle,
} from '@dev-dga/react';
import { useT } from '@/i18n';
import { FORM_STEPS } from './form-state';

const STEP_KEYS = [
  'form.step.applicant',
  'form.step.details',
  'form.step.documents',
  'form.step.review',
] as const;

const STEP_DESC_KEYS = [
  'form.stepDesc.applicant',
  'form.stepDesc.details',
  'form.stepDesc.documents',
  'form.stepDesc.review',
] as const;

interface Props {
  step: number;
  onPreview: () => void;
}

export function FormChrome({ step, onPreview }: Props) {
  const t = useT();
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>{t('form.menu.file')}</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onSelect={() => navigate('/requests/new')}>
              {t('form.menu.new')}
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onSelect={() => window.print()}>{t('form.menu.print')}</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>{t('form.menu.view')}</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onSelect={onPreview}>{t('form.menu.preview')}</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      <ProgressIndicator>
        {FORM_STEPS.map((s, i) => (
          <Step key={s} state={i < step ? 'completed' : i === step ? 'current' : 'upcoming'}>
            <StepIndicator step={i + 1} />
            <StepContent>
              <StepTitle>{t(STEP_KEYS[i])}</StepTitle>
              <StepDescription>{t(STEP_DESC_KEYS[i])}</StepDescription>
            </StepContent>
          </Step>
        ))}
      </ProgressIndicator>
    </div>
  );
}
