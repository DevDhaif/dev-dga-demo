import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerClose,
  Button,
  DescriptionList,
  DescriptionItem,
  DescriptionTerm,
  DescriptionDetails,
} from '@dev-dga/react';
import { staffById } from '@/data/fixtures';
import { DOCKIND_KEY, formatDate, formatSizeKB } from '@/data/labels';
import { tField, useLang, useT } from '@/i18n';
import type { DocumentsController } from './use-documents';

export function DocumentDrawer({ d }: { d: DocumentsController }) {
  const t = useT();
  const lang = useLang();
  const doc = d.selected;
  const uploader = doc ? staffById(doc.uploadedBy) : undefined;

  return (
    <Drawer open={doc !== null} onOpenChange={(o) => !o && d.setSelected(null)}>
      <DrawerContent side="end">
        <DrawerHeader>
          <DrawerTitle>{t('docs.detail')}</DrawerTitle>
          <DrawerDescription>{doc ? tField(doc.title, lang) : ''}</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          {doc && (
            <div className="flex flex-col gap-3">
              <DescriptionList divided>
                <DescriptionItem>
                  <DescriptionTerm>{t('docs.kind')}</DescriptionTerm>
                  <DescriptionDetails>{t(DOCKIND_KEY[doc.kind])}</DescriptionDetails>
                </DescriptionItem>
                <DescriptionItem>
                  <DescriptionTerm>{t('docs.size')}</DescriptionTerm>
                  <DescriptionDetails>{formatSizeKB(doc.sizeKB)}</DescriptionDetails>
                </DescriptionItem>
                <DescriptionItem>
                  <DescriptionTerm>{t('docs.uploadedBy')}</DescriptionTerm>
                  <DescriptionDetails>
                    {uploader ? tField(uploader.name, lang) : doc.uploadedBy}
                  </DescriptionDetails>
                </DescriptionItem>
                <DescriptionItem>
                  <DescriptionTerm>{t('docs.uploadedAt')}</DescriptionTerm>
                  <DescriptionDetails>{formatDate(doc.uploadedAt)}</DescriptionDetails>
                </DescriptionItem>
              </DescriptionList>
              <Button variant="destructive" onClick={() => d.remove(doc.id)}>
                {t('common.delete')}
              </Button>
              <DrawerClose asChild>
                <Button variant="ghost">{t('common.close')}</Button>
              </DrawerClose>
            </div>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
