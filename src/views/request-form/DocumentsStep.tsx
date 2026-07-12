import {
  FileUpload,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  Textarea,
  List,
  ListItem,
  Tag,
} from '@dev-dga/react';
import { RowList, RowItem } from '@/components/RowList';
import { STATUS_BADGE, STATUS_KEY, formatDate, formatSizeKB } from '@/data/labels';
import { tField, useLang, useT } from '@/i18n';
import { serviceById } from '@/data/fixtures';
import type { RequestFormController } from './use-request-form';

export function DocumentsStep({ f }: { f: RequestFormController }) {
  const t = useT();
  const lang = useLang();

  return (
    <div className="flex max-w-xl flex-col gap-4">
      <FileUpload
        label={t('form.docs.upload')}
        description={t('form.docs.help')}
        files={f.files}
        onFilesAdded={f.onFilesAdded}
        onRemove={f.onRemoveFile}
        multiple
      />
      {f.existing && f.existing.attachments.length > 0 && (
        <List data-testid="existing-attachments">
          {f.existing.attachments.map((a) => (
            <ListItem key={a.id}>
              {a.name} · {formatSizeKB(a.sizeKB)}
            </ListItem>
          ))}
        </List>
      )}
      {f.history.length > 0 && (
        <Accordion type="single" collapsible>
          <AccordionItem value="history">
            <AccordionTrigger>{t('form.history')}</AccordionTrigger>
            <AccordionContent>
              <RowList divided>
                {f.history.map((r) => (
                  <RowItem
                    key={r.id}
                    primary={`${r.id} - ${tField(serviceById(r.serviceId)?.name ?? { en: r.serviceId, ar: r.serviceId }, lang)}`}
                    secondary={formatDate(r.submittedAt)}
                    trailing={
                      <Tag size="sm" variant={STATUS_BADGE[r.status]}>
                        {t(STATUS_KEY[r.status])}
                      </Tag>
                    }
                  />
                ))}
              </RowList>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
      {f.existing && (
        <Collapsible>
          <CollapsibleTrigger>{t('form.internalNotes')}</CollapsibleTrigger>
          <CollapsibleContent>
            <Textarea
              aria-label={t('form.internalNotes')}
              value={f.draft.notes}
              onChange={(e) =>
                f.mark(() => f.send({ type: 'set', patch: { notes: e.target.value } }))()
              }
              rows={3}
            />
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
