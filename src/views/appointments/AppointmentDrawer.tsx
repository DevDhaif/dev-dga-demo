import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerClose,
  Button,
  Badge,
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalClose,
} from '@dev-dga/react';
import { serviceById } from '@/data/fixtures';
import { APTSTATUS_BADGE, APTSTATUS_KEY, formatDate } from '@/data/labels';
import { tField, useLang, useT } from '@/i18n';
import type { AppointmentsController } from './use-appointments';

export function AppointmentDrawer({ a }: { a: AppointmentsController }) {
  const t = useT();
  const lang = useLang();
  const apt = a.selected;

  return (
    <>
      <Drawer open={apt !== null} onOpenChange={(o) => !o && a.setSelected(null)}>
        <DrawerContent side="end">
          <DrawerHeader>
            <DrawerTitle>{t('apt.detail')}</DrawerTitle>
            <DrawerDescription>{apt ? tField(apt.citizen, lang) : ''}</DrawerDescription>
          </DrawerHeader>
          <DrawerBody>
            {apt && (
              <div className="flex flex-col gap-3">
                <p className="m-0">
                  {t('apt.service')}:{' '}
                  {tField(
                    serviceById(apt.serviceId)?.name ?? { en: apt.serviceId, ar: apt.serviceId },
                    lang,
                  )}
                </p>
                <p className="m-0">
                  {t('apt.center')}: {tField(apt.center, lang)}
                </p>
                <p className="m-0">
                  {t('apt.time')}: {formatDate(apt.date)} · {apt.time} ·{' '}
                  {t('apt.minutes', { n: apt.durationMin })}
                </p>
                <Badge className="w-fit self-center" variant={APTSTATUS_BADGE[apt.status]}>
                  {t(APTSTATUS_KEY[apt.status])}
                </Badge>
                {apt.status === 'booked' && (
                  <Button variant="destructive" onClick={() => a.setCancelOpen(true)}>
                    {t('apt.cancel')}
                  </Button>
                )}
                <DrawerClose asChild>
                  <Button variant="ghost">{t('common.close')}</Button>
                </DrawerClose>
              </div>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Modal open={a.cancelOpen} onOpenChange={a.setCancelOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>{t('apt.confirmCancel.title')}</ModalTitle>
            <ModalDescription>
              {t('apt.confirmCancel.body', { name: apt ? tField(apt.citizen, lang) : '' })}
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <ModalClose asChild>
              <Button variant="ghost">{t('common.cancel')}</Button>
            </ModalClose>
            <Button variant="destructive" onClick={() => apt && a.cancel(apt.id)}>
              {t('common.confirm')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
