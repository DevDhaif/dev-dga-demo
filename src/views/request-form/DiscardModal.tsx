import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalClose,
  Button,
} from '@dev-dga/react';
import { useT } from '@/i18n';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DiscardModal({ open, onOpenChange, onConfirm }: Props) {
  const t = useT();
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{t('form.discard.title')}</ModalTitle>
          <ModalDescription>{t('form.discard.body')}</ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="ghost">{t('common.cancel')}</Button>
          </ModalClose>
          <Button variant="destructive" onClick={onConfirm}>
            {t('form.discard.confirm')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
