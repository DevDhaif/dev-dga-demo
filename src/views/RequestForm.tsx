import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  InlineAlert,
  Button,
  EmptyState,
  Link,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@dev-dga/react';
import { useT } from '@/i18n';
import { useRequestForm } from './request-form/use-request-form';
import { FORM_STEPS, validateStep } from './request-form/form-state';
import { FormChrome } from './request-form/FormChrome';
import { ApplicantStep } from './request-form/ApplicantStep';
import { DetailsStep } from './request-form/DetailsStep';
import { DocumentsStep } from './request-form/DocumentsStep';
import { ReviewStep } from './request-form/ReviewStep';
import { DiscardModal } from './request-form/DiscardModal';

export function RequestForm() {
  const t = useT();
  const f = useRequestForm();
  const [tab, setTab] = useState('form');

  if (f.notFound) {
    return (
      <EmptyState
        title={t('form.notFound')}
        action={
          <Link asChild>
            <RouterLink to="/requests">{t('queue.title')}</RouterLink>
          </Link>
        }
      />
    );
  }

  const isLast = f.draft.step === FORM_STEPS.length - 1;
  const steps = [ApplicantStep, DetailsStep, DocumentsStep, ReviewStep] as const;
  const CurrentStep = steps[f.draft.step];

  return (
    <div className="flex flex-col gap-4">
      <h1 className="m-0">
        {f.isNew ? t('form.titleNew') : t('form.titleEdit', { id: f.existing?.id ?? '' })}
      </h1>

      <FormChrome step={f.draft.step} onPreview={() => setTab('preview')} />

      {f.dirty && (
        <InlineAlert type="warning" title={t('form.unsaved')}>
          {t('form.discard.body')}
        </InlineAlert>
      )}

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="form">{t('form.tab.form')}</TabsTrigger>
          <TabsTrigger value="preview">{t('form.tab.preview')}</TabsTrigger>
        </TabsList>
        <TabsContent value="form" className="pt-3">
          <CurrentStep f={f} />
        </TabsContent>
        <TabsContent value="preview" className="pt-3">
          <ReviewStep f={f} />
        </TabsContent>
      </Tabs>

      {tab === 'form' && (
        <footer className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" onClick={() => f.setDiscardOpen(true)}>
            {t('common.cancel')}
          </Button>
          <span className="ms-auto" />
          <Button
            variant="secondary"
            disabled={f.draft.step === 0}
            onClick={() => f.send({ type: 'back' })}
          >
            {t('form.back')}
          </Button>
          {isLast ? (
            <Button variant="primary" disabled={!validateStep(f.draft, 3)} onClick={f.submit}>
              {f.isNew ? t('form.submit') : t('common.save')}
            </Button>
          ) : (
            <Button
              variant="primary"
              disabled={!validateStep(f.draft, f.draft.step)}
              onClick={() => f.send({ type: 'next' })}
            >
              {t('form.next')}
            </Button>
          )}
        </footer>
      )}

      <DiscardModal
        open={f.discardOpen}
        onOpenChange={f.setDiscardOpen}
        onConfirm={f.confirmDiscard}
      />
    </div>
  );
}
